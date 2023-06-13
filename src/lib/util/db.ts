import { createClient } from "@libsql/client/web";
import { DB_TOKEN } from "$env/static/private";
import { createObject, getObject, deleteObject } from "$lib/util/s3";
import { md5 } from "hash-wasm";

const client = createClient({
    url: "libsql://worthy-asgardian-will-lol.turso.io",
    authToken: DB_TOKEN
});

export async function createUser(username: string) {
    const output = await client.execute({ sql: "insert into UserTable (githubUsername) values (?) returning id", args: [username] });
    return output.rows[0];
}

export async function deleteData(id: number) {
    const s3Key = await client.execute({ sql: "select s3key from DataTable where id = ?", args: [id] }).then((res) => res.rows[0][0]) as string;
    await deleteObject(s3Key);
    await client.execute({ sql: "delete from DataTable where id = ?", args: [id] });
}

export async function uploadData(username: string, data: string | Uint8Array | Buffer) {
    const uuid = globalThis.crypto.randomUUID();
    const dataHash = await md5(data);
    const dataAlreadyExists: boolean = await client.execute({ sql: "select * from DataTable where hash = ?", args: [dataHash] }).then((res) => res.rows.length > 0);
    if (dataAlreadyExists) {
        throw "data already exists"
    }
    const status = await createObject(uuid, data).then((res) => res.$metadata.httpStatusCode);
    if (status != 200) {
        throw "could not upload to s3"
    }
    await client.execute({ sql: "insert into DataTable (s3key, username, hash) values (?, ?, ?)", args: [uuid, username, dataHash] });
}

export async function retreiveData(username: string): Promise<{data: Uint8Array | undefined, id: string}[]> {
    const dbResults = await client.execute({ sql: "select s3key,id from DataTable where username = ?", args: [username] });
    const dbResultsMap = await Promise.all(dbResults.rows.map(async (elem) => {
        return {data: await getObject(elem[0] as string).then((res) => res.Body?.transformToByteArray()), id: elem[1] as string};
    }));
    return dbResultsMap;
}