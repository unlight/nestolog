import { Logger, Module } from '@nestjs/common';

import { ConfigurableModuleClass } from './nestolog.module-definition';
import { NestoLogger } from './nestologger.service';

@Module({
  exports: [NestoLogger, Logger],
  providers: [NestoLogger, Logger],
})
export class NestologModule extends ConfigurableModuleClass {}
