# Projet NodeJS

## Prerequisites
- NodeJS 16
  - If you use nvm, run `nvm use` to use the correct version
- yarn 1.22
- docker and docker-compose

## Dev installation
- Install dependencies
  ```sh
  yarn install
  ```

- Add a `.env` file at the root of the project with the following content:
  ```sh
  DATABASE_URL="postgresql://user:password@localhost:5432/nft?schema=public"
  JWT_SECRET=Som3thinGSe3cret
  ```

- Setup the database
  ```sh
  yarn db:dev
  ```

- Start the server
  ```sh
  yarn start:debug
  ```
