<img width="1225" alt="glue-logo-wide" src="https://user-images.githubusercontent.com/32162112/174629275-00deff63-7ff2-4f5e-9df9-40576b26c30f.png">

# development 👷‍♀️

## prerequisites

-   `node v18.3.0`
-   [`mongodb`](https://www.mongodb.com/docs/manual/installation/)
-   `.env` file with the following entries:

    -   DISCORD_OAUTH_CLIENT_ID
        -   the applications [client id](https://discord.com/developers/docs/topics/oauth2)
    -   DISCORD_OAUTH_SECRET
        -   the applications client secret
    -   DISCORD_CALLBACK_URL
        -   the callback url specified in your oauth2 url
    -   DISCORD_TOKEN
        -   your discord bots token
    -   PORT
        -   the port on which the server will listen
    -   SESSION_SECRET
        -   the [session secret](https://expressjs.com/en/resources/middleware/session.html) used to sign the session cookie
    -   MONGO_URL

        -   a [connection](https://www.mongodb.com/docs/manual/reference/connection-string/) string to the mongodb database
        -   if authentication is needed, make sure the connection string has the right format, e.g. `mongodb://myusername:mypassword@127.0.0.1:27017/glue_discord?authSource=admin`
            -   the `authSource` parameter is necessary to authenticate against the `admin` database
            -   make sure you avoid special characters in the password as it leads to annoying complications

    -   BACKEND_CANISTER_ID
        -   the canister id of the `glue` [backend canister](https://github.com/glue-org/glue/tree/main/src/backend), use the local canister id when developing and a canister from the mainnet when deploying to production
    -   HOST
        -   in a node environment we have to specify a host for the agent to work, use the hostname of your local deployment ofthe [glue](https://github.com/glue-org/glue) frontend for development and `https://ic0.app` for production

## local deployment

-   run `yarn install` to install all dependencies
-   make sure the local deployment of [glue](https://github.com/glue-org/glue/) is running
-   run `yarn start:dev` to run a development `nodemon` server (make sure your node version is correct, run `nvm use` if in doubt)

## deploying to production

-   run `yarn build` to build the express server
-   you can then use something like [pm2](https://pm2.io/) to deploy the server to production
-   to make the express server listen to incoming request to your server, expose it using a `nginx` reverse proxy
    > :warning: **when using nginx reverse proxy**: make sure you set the correct proxy headers for `nginx` and trust proxy setting for `express` like [here](https://github.com/expressjs/session/issues/281)!
