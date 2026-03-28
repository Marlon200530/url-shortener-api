import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use('/api', routes);


export default app;

