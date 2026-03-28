import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use('/api', routes);
app.use(notFoundHandler);
app.use(errorHandler);


export default app;
