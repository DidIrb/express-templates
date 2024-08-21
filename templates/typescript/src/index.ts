import express, { Request, Response } from 'express';
import config from './config/env';

const app = express();
const port = config.port || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port} in ${config.env} mode.`);
});