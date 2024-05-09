import { ConfigurableModuleBuilder } from '@nestjs/common';

import { NestologOptions } from './nestolog-options';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<Partial<NestologOptions>>({
    optionsInjectionToken: 'NESTOLOG_OPTIONS',
  }).build();
