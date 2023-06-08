import { createClient } from "@libsql/client";
import { DB_TOKEN } from "$env/static/private";
import { createObject } from "$lib/util/s3";
import { md5 } from "hash-wasm";

const client = createClient({
    url: "libsql://worthy-asgardian-will-lol.turso.io",
    authToken: DB_TOKEN
});

export async function createUser(username: string) {
    const output = await client.execute({ sql: "insert into UserTable (githubUsername) values (?) returning id", args: [username] });
    return output.rows[0];
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
    const url = `https://musicdatasnapshot.s3.ap-southeast-2.amazonaws.com/${uuid}`;
    await client.execute({ sql: "insert into DataTable (linkToS3, username, hash) values (?, ?, ?)", args: [url, username, dataHash] });
}