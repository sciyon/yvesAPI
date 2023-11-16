import swaggerJsdoc from 'swagger-jsdoc';


const options:  swaggerJsdoc.Options = {
  definition:{
    openapi: '3.0.0',
    info: {
      title: 'yvesAPI Documentation',
      version: '1.0.0',
      description: 'An API documentation implemented in swaggerUI for yvesAPI, a REST API made for CS3105 Application Development',
    },
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
  },
  apis: ["**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);