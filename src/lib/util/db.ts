import { createClient } from "@libsql/client/web";
import { DB_TOKEN } from "$env/static/private";
import { createObject, getObject, deleteObject } from "$lib/util/s3";
import { md5 } from "hash-wasm";
import type { retrieveAllDataApi } from "$lib/util/zod"

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

export async function uploadData(username: string, data: string | Uint8Array | Buffer, date: Date) {
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
    await client.execute({ sql: "insert into DataTable (s3key, username, hash, date) values (?, ?, ?, ?)", args: [uuid, username, dataHash, date.valueOf()] });
}

export async function retreiveFromDB(username: string): Promise<retrieveAllDataApi> {
    const dbResults = await client.execute({ sql: "select s3key,id,date from DataTable where username = ?", args: [username] });
    return dbResults.rows.map((el) => {return {s3Key: el[0] as string, id: el[1] as number, date: new Date(el[2] as number)}})
}

export async function getFromS3(s3key: string): Promise<string | undefined> {
    return getObject(s3key).then((res) => res.Body?.transformToString())
}