# iPod Listening Statistics (Computer Science IA)
## Installation
### Environment variables
The project depends on a number of environment variables that are *optional* but **recommended**. Without these variables, **many features will not work**. 

1. PUBLIC_CLIENT_ID
2. CLIENT_SECRET
3. DB_TOKEN
4. DB_URL
5. AWS_ACCESS_KEY_ID
6. AWS_SECRET_ACCESS_KEY
7. S3_BUCKET_ID
8. S3_REGION

All of the environment variables must be present in a `.env` file in order for the project to work.

#### PUBLIC_CLIENT_ID, CLIENT_SECRET
You must [create a GitHub app](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app). The PUBLIC_CLIENT_ID is listed as the 'Client ID' in the GitHub app setting page. Client secrets may also be generated here.

#### DB_TOKEN, DB_URL
The DB_TOKEN and DB_URL may be any libsql token and URL. The URL is in the following format:

`DB_URL="libsql://*.*"`

I used the [Turso](https://turso.tech/) database, this one will work well. 
You may execute the following SQL command to generate the required table:

`CREATE TABLE DataTable(id INTEGER PRIMARY KEY, s3key STRING, username STRING, hash STRING, date INTEGER);`

#### S3_BUCKET_ID, S3_REGION
These credentials are related to AWS S3. To create these credentials, create an AWS S3 Bucket and obtain these variables from the [AWS S3 Dashboard](https://s3.console.aws.amazon.com/s3/home). The ID is your bucket's name, the region is the bucket's AWS region. 

#### AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
These tokens are used to access an S3 bucket. You must create an AWS S3 bucket, and then an AWS IAM user to obtain these credentials. Once an S3 bucket has been created, use the IAM console to create a new IAM user and IAM user group. Use the AWS console to create a user. When prompted for permissions, create a new AWS user group with the `AmazonS3FullAccess` policy. Once the user has been created, head to its dashboard and go to the `Security Credentials` tab. Create a new access key and select `Application running outside AWS`. The key ID and secret access key will now be visible.

### Installing and executing
#### Dependencies 
[NodeJS](https://nodejs.org/en) is required. Version 20.1.0 was used to develop the project, most versions will work fine.

`git clone https://github.com/will-lol/ComputerScienceIA.git`

`cd ComputerScienceIA`

`npm install`

`npm run build` OR `npm run dev` (for dev server) OR `npm run preview` (executing built files) 

## Project organisation 
All code is stored in the `src` directory. Within the `src` directory, the `routes` directory contains all of the routes using folder based routing. This means that the root of the routes folder is the `https://example.com/` route, `routes/results` is `https://example.com/results`. The entrypoints for routes are the `+page.svelte` files. If a `+page.server.ts` file is present, it executes first on the server and the resultant data is passed to the `+page.svelte` file. If a `+server.ts` file is present, the route is a server only (api) route and it won't return HTML. All other files, such as `Home.svelte` are components that are used only once or are specific to the route.

The `lib` directory contains code and other libraries used in code that are not specific to a particular route. `lib/util` contains many abstractions that could be or are used across different routes and files.