

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chat App API',
      version: '1.0.0',
      description: 'API documentation for the Chat App backend (authentication and messaging)',
    },
    servers: [
      {
        url: 'http://localhost:7000',
        description: 'Local development server',
      },
    ],
    tags: [
      {
        name: 'User',
        description: 'Authentication endpoints (register/login)',
      },
      {
        name: 'Messages',
        description: 'Endpoints for sending and retrieving messages',
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
    },
  },

    apis: [path.resolve(__dirname, '../routes/*.js')], // for ESM

};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('/api-docs-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}































// npm install swagger-jsdoc
// npm install swagger-ui-express