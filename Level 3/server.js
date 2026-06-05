require('dotenv').config()
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app= require('./src/app')

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
      description: 'A simple Express API documented with Swagger JSDoc',
    },
    servers: [
      {
        url: `http://localhost:3000`,
      },
    ],
  },
  // Path to the API docs containing JSDoc comments
  apis: ['./src/routes/weather.routes.js'], 
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Use swagger-ui-express to serve the documentation UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.listen(3000,()=>{
    console.log("App listening on 3000")
})