# skeleton-project
> GrandLineX skeleton project

## Includes

- Full **Typescript** project setup
- **Jest** test and coverage config
- Docker-Compose file for **Development Database**
- **ESLint** config with AirBnB & Prettier presets
- GrandLineX **OpenApi** generator config
- Example **Kernel Extension** code `@/src`

## Quick Start

1. Clone `git https://github.com/GrandlineX/skeleton-project.git && cd skeleton-project` 
2. Install dependencies `npm install`
3. Start database `docker-compose up -d`
4. Build project `npm run build`;
5. Build project `npm run start`;

## Additional commands

|Command|Description|
|---|---|
|`npm run lint`| start ESLint |
|`npm run test`| start Jest test collection (creates db entry's) |
|`npm run test-converage`| start Jest test collection + coverage report (creates db entry's) |
|`npm run start-dev`| start dev script with disabled cors |
|`npm run makeDocs`| generates Typedoc documentation|
|`npm run makeSpec`| generates OpenApi spec [see](https://grandlinex.github.io/docs/utils/#docs-to-openapi-v3)|
|`npm run serveSpec`| generates OpenApi spec [see](https://grandlinex.github.io/docs/utils/#docs-to-openapi-v3) + serve Swagger UI|
