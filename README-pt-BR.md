![Badge em Desenvolvimento](http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=GREEN&style=for-the-badge)

<p align="center">
<img src="https://img.shields.io/github/contributors/ThiLourenco/delivery-backend" alt="GitHub contributors" />
<img src="https://img.shields.io/github/discussions/ThiLourenco/delivery-backend" alt="GitHub discussions" />
<img src="https://img.shields.io/github/issues/ThiLourenco/delivery-backend" alt="GitHub issues" />
<img src="https://img.shields.io/github/issues-pr/ThiLourenco/delivery-backend" alt="GitHub pull request" />
</p>

*Este readme também pode ser lido em  [Português](README-pt-BR.md) ou [English](README.md).*


## Delivery API

Este é o backend para o sistema de entrega, desenvolvido utilizando Node.js, Express, Typescript, Prisma ORM com PostgreSQL e Swagger para documentação da API.

## Estrutura do Projeto
* src/controllers: Contém os controladores das rotas.
* src/repositories: Contém os repositórios para interagir com o banco de dados.
* src/services: Contém os serviços que implementam a lógica de negócio.
* src/http/server.ts: Arquivo de entrada do servidor Express.
* src/http/routes/index.ts: Contém as rotas da aplicação.


## Documentação da API
A documentação completa da API pode ser acessada em http://localhost:5555/api-docs após iniciar o servidor. A documentação é gerada utilizando Swagger.



## Requisitos

- Node.js v20.0.0 ou superior
- PostgreSQL
- pnpm ou npm
- Docker

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/ThiLourenco/delivery-backend.git
cd delivery-backend
```
2. Instale as dependências:
```bash
pnpm install
ou
npm install
```

3. Instalação com Docker:

Este repositório contém os artefatos necessários para executar usando Docker. Primeiro de tudo, você precisará instalar alguns pré-requisitos, caso ainda não estejam instalados:

* Instalar o [Docker](https://docs.docker.com/get-docker/).

```bash 
  docker compose up
```

4. Configure o banco de dados PostgreSQL e crie um arquivo .env na raiz do projeto com a URL do banco de dados:

```bash
DATABASE_URL=postgresql://<usuario>:<senha>@<host>:<porta>/<database>?schema=public
```
5. Execute as migrações do Prisma para criar as tabelas no banco de dados:

```bash
npx prisma migrate dev --name init
```

6. Gere o cliente Prisma:
```bash
npx prisma generate
```
## Executando o Servidor

Para iniciar o servidor em modo de desenvolvimento, use:
```bash
pnpm dev
ou
npm run dev
```
O servidor será iniciado em http://localhost:5555 ou sua porta preferida.

## Contribuição
Se você deseja contribuir com este projeto, siga os passos abaixo:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature (git checkout -b minha-feature).
3. Commit suas alterações (git commit -am 'Adiciona nova feature').
4. Envie para o branch (git push origin minha-feature).
5. Crie um novo Pull Request.

## Contribuidores
<a href="https://github.com/ThiLourenco/e-commerce/graphs/contributors">
<img src="https://contrib.rocks/image?repo=ThiLourenco/e-commerce" />
</a>

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [**MIT License**](https://github.com/ThiLourenco/delivery-backend/blob/main/LICENSE) para mais detalhes.

