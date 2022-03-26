import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

import { ASYNC_STORAGE, AsyncLocalStorageType } from './async-storage.provider';

@Injectable()
export class AsyncStorageInterceptor implements NestInterceptor {
    constructor(
        @Inject(ASYNC_STORAGE) private readonly asyncStorage: AsyncLocalStorageType,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
        // todo: move to header and config
        const requestId = Date.now().toString(36);
        const store = new Map().set('requestId', requestId);
        return this.asyncStorage.run(store, () => {
            return next.handle().toPromise();
        });
    }
}
