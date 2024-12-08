import { Inject, Injectable, LoggerService } from '@nestjs/common';
import ansicolor from 'ansicolor';
import ololog from 'ololog';
import StackTracey from 'stacktracey';
import tinydate from 'tinydate';
import wrapAnsi from 'wrap-ansi';

import { messageColumnWidth } from './message-column-width';
import { MODULE_OPTIONS_TOKEN } from './nestolog.module-definition';
import {
  customLocateDefault,
  type NestologOptions,
  nestologOptionsDefaults,
} from './nestolog-options';
import { bullet, stringify } from './string';
import { Entry } from './types';

@Injectable()
export class NestoLogger implements LoggerService {
  verbose = this.debug.bind(this);
  private logger: typeof ololog;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private readonly options: NestologOptions,
  ) {
    this.logger = this.createLogger(ololog);
  }

  static create(options?: Partial<NestologOptions>) {
    return new NestoLogger({ ...nestologOptionsDefaults, ...options });
  }

  private createLogger(logger: ololog) {
    logger = logger.configure({ ...nestologOptionsDefaults, ...this.options });
    const width =
      this.options.messageColumnWidth ||
      messageColumnWidth(this.options, logger);

    if (width && width > 0) {
      logger = logger.configure({
        '+lines': (lines: string[]) => {
          lines = lines.map(line => wrapAnsi(line, width, { trim: false }));
          return lines;
        },
        locate: false,
      });
    }

    if (this.options.timeFormat) {
      const format = tinydate(this.options.timeFormat);
      logger = logger.configure({
        time: {
          print: (date: Date) => {
            return ansicolor.darkGray(format(date));
          },
          yes: true,
        },
      });
    }

    return logger;
  }

  log(message: unknown, context?: string): void {
    const where = new StackTracey().clean().at(1);
    const log = this.logger.configure({
      'concat+': this.concatContext({ context, where }),
      locate: { where },
      render: { consoleMethod: 'info' },
      tag: { level: 'info' },
    });
    log(message);
  }

  warn(message: unknown, context?: string): void {
    const where = new StackTracey().clean().at(1);
    const log = this.logger.configure({
      'concat+': this.concatContext({ context, where }),
      locate: { where },
      render: { consoleMethod: 'warn' },
      tag: { level: 'warn' },
    });
    log(message);
  }

  error(message: unknown, trace?: string, context?: string): void {
    const where = new StackTracey().clean().at(1);
    const log = this.logger.configure({
      'concat+': this.concatContext({ context, where }),
      locate: { where },
      render: { consoleMethod: 'error' },
      tag: { level: 'error' },
    });
    if (!trace && message instanceof Error && !message.stack) {
      Error.captureStackTrace(message);
    }
    log(message);
    if (trace) {
      log(trace);
    }
  }

  debug(message: unknown, context?: string): void {
    const where = new StackTracey().clean().at(1);
    const log = this.logger.configure({
      'concat+': this.concatContext({ context, where }),
      locate: { where },
      render: { consoleMethod: 'debug' },
      tag: { level: 'debug' },
    });
    log(message);
  }

  private concatContext({
    context,
    where,
  }: {
    context?: string;
    where?: Entry;
  }) {
    const { contextLimit, customLocateColumnLimit, customLocatePosition } =
      this.options;
    const customLocate =
      this.options.customLocate === true
        ? customLocateDefault
        : this.options.customLocate;
    return (lines: string[]) => {
      if (where && customLocate) {
        let calleeInfo = customLocate(where, this.options);
        if (customLocatePosition === 'column') {
          calleeInfo = calleeInfo.padEnd(customLocateColumnLimit);
          calleeInfo = stringify.limit(calleeInfo, customLocateColumnLimit);
          lines = bullet(ansicolor.darkGray(calleeInfo) + ' ', lines);
        } else if (customLocatePosition === 'context' && !context) {
          calleeInfo = customLocate(where, {
            ...this.options,
            customLocateColumnLimit: contextLimit,
          });
          context = calleeInfo;
        } else {
          lines.push(ansicolor.darkGray(calleeInfo));
        }
      }
      if (context) {
        if (contextLimit > 0) {
          context = stringify.limit(context, contextLimit).padEnd(contextLimit);
        }
        lines = bullet(ansicolor.yellow(context + ' '), lines);
      }
      return lines;
    };
  }
}
