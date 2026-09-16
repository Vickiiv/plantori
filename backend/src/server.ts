import { env } from './config/env';
import app from './app';
import { connectDB } from './config/db';

async function start() {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`Server laeuft auf http://localhost:${env.PORT}`);
  });
}

start();
