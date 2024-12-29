// backend/swagger.ts
import { Router } from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';


const baseDir = path.join(__dirname, '/../../src/'); // Remonte au bon niveau

console.log('baseDir:', baseDir);
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LiveChat API Documentation',
      version: '1.0.0',
      description: 'Documentation des endpoints REST du projet LiveChat',
    },
  },
  apis: [
    path.join(baseDir, 'index.ts'),
    path.join(baseDir, 'db', 'req.ts'),
    path.join(baseDir, 'swagger.yaml'), // Inclut le fichier
  ],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

const swaggerRouter = Router();

// Endpoint pour Swagger UI
swaggerRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default swaggerRouter;
