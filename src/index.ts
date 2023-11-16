import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose, { mongo } from 'mongoose';

import router from './router';
import { swaggerSpec } from './utils/swagger';
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(cors({
  credentials: true,
}))
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log('Server running on http://localhost:8080/');
})

const MONGO_URL = 'mongodb+srv://matchaccy:BeC1CiYYQpZ2ypX2@cluster0.6hxebjk.mongodb.net/?retryWrites=true&w=majority'

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));


app.use('/', router());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));