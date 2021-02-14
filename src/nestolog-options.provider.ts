import { Provider } from '@nestjs/common';
import ololog from 'ololog';

export const NESTOLOG_OPTIONS = Symbol('NESTOLOG_OPTIONS');

export const nestologOptionsDefaults = {
    time: true,
    locate: true,
    tag: true,
    contextLimit: 13,
    /**
     * Word wrap width for message.
     * If 0 (default) tries to auto detect.
     * If -1 disable
     */
    messageColumnWidth: 0,
};

export const nestologOptionsProvider: Provider = {
    provide: NESTOLOG_OPTIONS,
    useValue: nestologOptionsDefaults,
};

export type NestologOptions = Partial<
    typeof nestologOptionsDefaults & Parameters<typeof ololog.configure>[0]
>;
