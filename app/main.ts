import { NestFactory } from '@nestjs/core';

import { NestoLogger } from '../src';
import { AppModule, configureApp } from './app.module';

async function main() {
  const app = await NestFactory.create(AppModule, {
    logger: NestoLogger.create(),
  });
  configureApp(app);

  await app.init();
  await app.listen(3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
