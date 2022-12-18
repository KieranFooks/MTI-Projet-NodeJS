# Projet NodeJS

## Authors
hugo.poujol
gabriel.lecherf
kieran.fooks

## Prerequisites

- NodeJS 16
  - If you use nvm, run `nvm use` to use the correct version
- yarn 1.22
- docker and docker-compose
- [dotenv-cli](https://www.npmjs.com/package/dotenv-cli)

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

- Launch the database

  ```sh
  yarn db:dev
  ```

- Setup the database

  ```sh
  yarn prisma:migrate:dev
  ```

- Start the server

  ```sh
  yarn start:debug
  ```

- Stop the database
  ```sh
  yarn db:down
  ```

## Run tests

- Add a `.env.test` file at the root of the project with the following content:

  ```sh
  DATABASE_URL="postgresql://user:password@localhost:5433/nft?schema=public"
  JWT_SECRET=Som3thinGSe3cret
  ```

- Make sure the database is running

  ```sh
  yarn db:dev
  ```

- Make sure the database is setup

  ```sh
  yarn prisma:migrate:dev
  ```

- Start the unit tests

  ```sh
  yarn test
  ```

- Start the integration tests
  ```sh
  yarn test:e2e
  ```

## The Architecture

The project is divided into 3 main parts:

- The `src` folder contains the source code of the project
- The `tests` folder contains the tests of the project
- The `prisma` folder contains the database schema, migrations and seed

### The `src` folder

The `src` folder contains the source code of the project. It is divided into 3 main parts:

- The `common` folder contains the common code of the project
- The `Models` folder contains the GraphQL models
- The other folders are the modules of the project. One for each table of the database.

### The `common` folder

The `common` folder contains the common code of the project. It is divided into 2 main parts:

- The `auth` folder contains the code related to the JWT authentication
- The `graph` folder contains the code related to the GraphQL

### The others folder

The other folders are the modules of the project. One for each table of the database. They are divided into:

- The `dto` folder contains the DTOs of the database section
- The `*.module.ts` file is the module of the database section
- The `*.resolver.ts` file is the resolver of the database section (contains the graphql queries and mutations)
- The `*.service.ts` file is the service of the database section (contains the business logic)
- The `*.decorator.ts` file is the decorator of the database section
- The `*.interceptor.ts` file is the interceptor of the database section
- The `*.spec.ts` file is the unit test of the database section

### The `tests` folder

The `tests` folder contains the integrations tests of the project. It is divided into 2 main parts:

- The `helpers` folder contains the helpers used in the tests
- The `*.e2e-spec.ts` files are the tests

### The `prisma` folder

The `prisma` folder contains the database schema, migrations and seed. It is divided into 3 main parts:

- The `migrations` folder contains the migrations of the database
- The `schema.prisma` file contains the schema of the database
- The `seed.ts` file contains the seed of the database

## Tests

Not all the code is tested because we didn't have enough time to do it. So we prioritized the integration tests over the unit tests.

## The GraphQL API

The GraphQL API is accessible at the following url: http://localhost:3000/graphql
All the required queries and mutations have been implemented.

### Authentication

In order to create a new user, you have to call the `signUp` mutation. It will return the generated password.

In order to get the JWT token, you have to call the `signIn` mutation. It will return the JWT token.

An admin user has been created in the seed. You can use it to test the admin queries and mutations. The email is `admin@admin.com` and the password is `admin`.

### Must Do

For the Must Do section, we have implemented the following queries and mutations:

- Query: `bestSellersTeam`
- Query: `bestSellersCollections`
- Query: `mostRatedNfts`
- Query: `lastSells`
- Query: `myLastSells` (requires JWT authorization)
