import dotenv from 'dotenv'

type envObj = {
    CLIENT_ID: string,
    CLIENT_SECRET: string
}

const env = dotenv.config().parsed;
if (env == undefined) {
    throw "no env"
}

export default env as envObj;
