import {
  INestApplication,
  INestMicroservice,
  Logger,
  Module,
} from '@nestjs/common';

import { NestologModule } from '../src';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  imports: [NestologModule.register({})],
  providers: [AppService],
})
export class AppModule {}

export function configureApp(app: INestApplication | INestMicroservice) {
  const oldfn = app.registerRequestByContextId.bind(app);

  app.registerRequestByContextId = function (req, contextId) {
    console.log('contextId', contextId);
    debugger;
    return oldfn.apply(this, arguments as any);
  };

  if ('use' in app && typeof app.use === 'function') {
    // not alwasy may be handled
    // const server = app.getHttpServer();
    // server.on('request', function (req, res) {
    //   debugger;
    // });

    app.use(function (req, res, next) {
      // debugger;
      next();
    });
  }

  const logger = app.get(Logger);

  logger.log('Application configured');
}
