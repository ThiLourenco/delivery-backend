![Badge em Desenvolvimento](http://img.shields.io/static/v1?label=STATUS&message=%20DEVELOPMENT&color=GREEN&style=for-the-badge)

<p align="center">
<img src="https://img.shields.io/github/contributors/ThiLourenco/delivery-backend" alt="GitHub contributors" />
<img src="https://img.shields.io/github/discussions/ThiLourenco/delivery-backend" alt="GitHub discussions" />
<img src="https://img.shields.io/github/issues/ThiLourenco/delivery-backend" alt="GitHub issues" />
<img src="https://img.shields.io/github/issues-pr/ThiLourenco/delivery-backend" alt="GitHub pull request" />
</p>

*This readme can also be read in [Portuguese](README-pt-BR.md) or [English](README.md).*


## Delivery API

This is the backend of the delivery system, developed in Node.js, Express, Typescript, Prisma ORM with PostgreSQL and Swagger for API documentation.

## Project Structure
* src/controllers: Contains route controllers.
* src/repositories: Contains the repositories to interact with the database.
* src/services: Contains the services that implement the business logic.
* src/http/server.ts: Express server input file.
* src/http/routes/index.ts: Contains the application routes.

## API documentation
Full API documentation can be accessed at http://localhost:5555/api-docs after starting the server. Documentation is generated using Swagger.



## Requirements

- Node.js Version >= v20.0.0
- PostgreSQL
- pnpm ou npm
- Docker

## Run Locally

1. Clone the repository:

```bash
git clone https://github.com/ThiLourenco/delivery-backend.git
cd delivery-backend
```
2. Install dependencies:
```bash
pnpm install
or
npm install
```
3. Installation with Docker-Compose:

This repository contains the artifacts necessary to run using Docker. First of all, you will need to install some prerequisites, if they are not already installed:

  * Install [Docker](https://docs.docker.com/get-docker/).


4. Configure the PostgreSQL database and create a .env file in the project root with the database URL: 
  

```bash
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>?schema=public
```
5. Run Prisma migrations to create the tables in the database:

```bash
npx prisma migrate dev --name init
```

6. Generate the Prisma client:
```bash
npx prisma generate
```
## Running the Server



To start the server in development mode, use:
```bash
pnpm dev
or 
npm run dev
```
The server will start at http://localhost:5555 or your preferred port.

## Contribution
If you want to contribute to this project, follow the steps below:

1. Fork the repository.
2. Create a branch for your feature (git checkout -b my-feature).
3. Commit your changes (git commit -am 'Add new feature').
4. Push to the branch (git push origin my-feature).
5. Create a new Pull Request.

## Contributors
<a href="https://github.com/ThiLourenco/e-commerce/graphs/contributors">
<img src="https://contrib.rocks/image?repo=ThiLourenco/e-commerce" />
</a>


## License

This project is licensed under the **MIT License** - see the [**MIT License**](https://github.com/ThiLourenco/delivery-backend/blob/main/LICENSE) file for details.