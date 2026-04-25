import express from 'express';
import 'dotenv/config.js';
import studentProutes from './routes/studentProutes.js';

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use('/studentportal', studentProutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(` listening on port ${port}...`);
});
