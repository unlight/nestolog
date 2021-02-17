import { Provider } from '@nestjs/common';
import ololog from 'ololog';

import { nestologOptionsDefaults } from './nestolog-options';

export const NESTOLOG_OPTIONS = Symbol('NESTOLOG_OPTIONS');

export const nestologOptionsProvider: Provider = {
    provide: NESTOLOG_OPTIONS,
    useValue: nestologOptionsDefaults,
};

export type NestologOptions = typeof nestologOptionsDefaults &
    Parameters<typeof ololog.configure>[0];

export { nestologOptionsDefaults };
