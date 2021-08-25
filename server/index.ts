import express, { Application } from 'express';
import { createServer } from 'http';
import userRouter from './routes/user.router';
import chatRouter from './routes/chat.router';
import eventRouter from './routes/event.router';
import googleApiRouter from './routes/googleApi.router';
import cors from 'cors';
import * as dotenv from 'dotenv';
import socketServer from './socket/index';

//TODO: install express-rate-limit to limit requests per IP
dotenv.config();
const SERVER_PORT = process.env['SERVER_PORT'] || 3100;
const app: Application = express();
const httpServer = createServer(app);

socketServer(httpServer);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRouter);
app.use(chatRouter);
app.use(eventRouter);
app.use(googleApiRouter);

httpServer.listen(SERVER_PORT, () => {
  console.log(`server is running ${SERVER_PORT}`);
});
