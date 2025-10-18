# Orientações
## Ao baixar o projeto:

```shell
npm i
```

Em seguida:

```shell
npm run migrate:latest:local
```

## Subir a aplicação local dev mode
```shell
npm run dev
```

## Fazer o build da aplicação
```shell
npm run build
```

## Subir a aplicação localmente a partir do build gerado
```shell
npm run start:local
```

## Inicializando as configurações do Knex
https://knexjs.org/guide/migrations.html#migration-cli

## Para usar o Knex com o tsx é preciso criar o seguinte script no package.json:
```
"scripts": {
  "knex": "node --import tsx ./node_modules/knex/bin/cli.js",
}
```

## Como criar uma migration
```shell
npm run knex --  migrate:make create-documents
```

## Aplicar todas as migrations faltantes
```shell
npm run migrate:latest:local
```

## Knex
- [Criação de tipagem para as tabelas](https://knexjs.org/guide/#typescript)

## Validação de entrada de dados nas rotas utilizando o ZOD
- [fastify / Documentation](https://fastify.dev/docs/v5.0.x/Reference/Type-Providers/)
- [fastify-type-provider-zod / Documentation](https://github.com/turkerdev/fastify-type-provider-zod)
- [fastify-type-provider-zod / Customizing error responses](https://github.com/turkerdev/fastify-type-provider-zod?tab=readme-ov-file#customizing-error-responses:~:text=Customizing%20error%20responses)

## Utilização de cookies com Fastify
- [fastify-cookie](https://github.com/fastify/fastify-cookie)
