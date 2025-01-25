import { Injectable } from '@nestjs/common';

import { NestoLogger } from '../src';

@Injectable()
export class AppService {
  constructor(private logger: NestoLogger) {}

  shared: string[] = [];

  addToShared(value: string) {
    this.shared.push(value);

    this.logger.debug(`Value to shared added '${value}'`, 'AppService');
  }

  getHello(): string {
    return 'Hello World! ' + new Date().toUTCString();
  }
}
