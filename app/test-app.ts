import { Injectable, Logger, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { NestologModule } from '../src/nestolog.module';
import { NestoLogger } from '../src/nestologger.service';

const loggerModule = NestologModule.register({});

@Injectable()
class UserService {
  constructor(
    private readonly logger: Logger,
    private readonly nestoLogger: NestoLogger,
  ) {
    nestoLogger.log('Hello from user service constructor');
    logger.log('Hello from user service constructor');
  }

  testLog() {
    this.nestoLogger.log('Hello from user service testLog');
    this.logger.log('Hello from user service testLog');
  }
}

@Module({
  imports: [loggerModule],
  providers: [UserService],
})
export class UserModule {}

@Module({
  imports: [UserModule, loggerModule],
})
export class AppModule {}

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule, {
    logger: NestoLogger.create({ tag: false, time: false }),
  });
  const port = process.env.PORT ?? 3333;
  app.useLogger(app.get(NestoLogger));

  await app.listen(port, () => {
    Logger.log(`Listening at http://localhost:${port}`);

    app.get(UserService).testLog();
  });
};

void bootstrap();
