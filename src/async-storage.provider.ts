import { Provider } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

export const ASYNC_STORAGE = Symbol('ASYNC_STORAGE');

export const asyncStorageProvider: Provider = {
    provide: ASYNC_STORAGE,
    useValue: new AsyncLocalStorage(),
};

export type AsyncLocalStorageType = AsyncLocalStorage<Map<string, string>>;
