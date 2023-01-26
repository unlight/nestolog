import { DynamicModule, Module } from '@nestjs/common';

// import { asyncStorageProvider } from './async-storage.provider';
import {
  NESTOLOG_OPTIONS,
  NestologOptions,
  nestologOptionsDefaults,
} from './nestolog-options';
import { NestoLogger } from './nestologger.service';

@Module({})
export class NestologModule {
  static forRoot(options: Partial<NestologOptions> = {}): DynamicModule {
    options = { ...nestologOptionsDefaults, ...options };
    return {
      module: NestologModule,
      providers: [
        // {
        //     provide: APP_INTERCEPTOR,
        //     useClass: AsyncStorageInterceptor,
        // },
        // asyncStorageProvider,
        {
          provide: NESTOLOG_OPTIONS,
          useValue: options,
        },
        NestoLogger,
      ],
      exports: [NestoLogger],
    };
  }
}
