import { SPathUtil, SwaggerConfig } from '@grandlinex/swagger-mate';
import ExampleEntity from './SkeletonModule/database/Entities/ExampleEntity';

/**
 * This is the swagger base template for the skeleton project
 */
const SwaggerConf: SwaggerConfig = {
  info: {
    version: '0.0.0',
    title: 'skeleton-project',
    description: 'Basic Auth RESTFull interface',
  },
  openapi: '3.0.3',
  paths: {
    /**
     * You can define your own path here
     */
    '/token': {
      post: {
        operationId: 'getApiToken',
        summary: 'Get Bearer for user.',
        description: 'Returns JWT',
        tags: ['Gateway', 'Kernel'],
        responses: {
          ...SPathUtil.jsonResponse(
            '200',
            {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
            false,
            '403',
            '400',
            '500'
          ),
        },
        requestBody: SPathUtil.jsonBody({
          type: 'object',
          properties: {
            username: {
              type: 'string',
            },
            token: {
              type: 'string',
            },
          },
          required: ['username', 'token'],
        }),
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  servers: [
    {
      url: 'http://localhost:9257',
      description: 'Dev server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      /**
       * You can define your own schema here
       * Schemas for GLX Entities can be auto  generated with the SPathUtil.schemaEntryGen() function
       */
      ...SPathUtil.schemaEntryGen(new ExampleEntity()),
    },
  },
};

export default SwaggerConf;
