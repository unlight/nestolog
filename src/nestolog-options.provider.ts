import { Provider } from '@nestjs/common';
import ololog from 'ololog';

import { nestologOptionsDefaults } from './nestolog-options';

export const NESTOLOG_OPTIONS = Symbol('NESTOLOG_OPTIONS');

export type NestologOptions = typeof nestologOptionsDefaults &
    Parameters<typeof ololog.configure>[0];

export { nestologOptionsDefaults };
