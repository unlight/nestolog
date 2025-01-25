import { setTimeout } from 'node:timers/promises';

import { Controller, Get, Logger } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  private logger = new Logger('AppController');
  constructor(private readonly appService: AppService) {}

  @Get('/')
  async index() {
    this.logger.debug('Start index');
    await setTimeout(10); // Imitate running process
    this.appService.addToShared(new Date().toUTCString());
  }
}
