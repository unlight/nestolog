import { Inject, Injectable, LoggerService, Optional } from '@nestjs/common';
import ansicolor from 'ansicolor';
import ololog from 'ololog';
import StackTracey from 'stacktracey';
import tinydate from 'tinydate';
import wrapAnsi from 'wrap-ansi';

import { messageColumnWidth } from './message-column-width';
import {
    type NestologOptions,
    customLocateDefault,
    NESTOLOG_OPTIONS,
} from './nestolog-options';
import { bullet, stringify } from './string';
import { Entry } from './types';

@Injectable()
export class NestoLogger implements LoggerService {
    verbose = this.debug.bind(this);

    constructor(
        @Inject(NESTOLOG_OPTIONS) private readonly options: NestologOptions,
        @Inject('ololog') @Optional() private readonly logger = ololog,
    ) {
        this.logger = this.createLogger(logger);
    }

    private createLogger(logger: ololog) {
        logger = logger.configure(this.options);
        const width =
            this.options.messageColumnWidth || messageColumnWidth(this.options, logger);

        if (width && width > 0) {
            logger = logger.configure({
                locate: false,
                '+lines': (lines: string[]) => {
                    lines = lines.map(line => wrapAnsi(line, width, { trim: false }));
                    return lines;
                },
            });
        }

        if (this.options.timeFormat) {
            const format = tinydate(this.options.timeFormat);
            logger = logger.configure({
                time: {
                    yes: true,
                    print: (date: Date) => {
                        return ansicolor.darkGray(format(date));
                    },
                },
            });
        }

        return logger;
    }

    log(message: unknown, context?: string): void {
        const where = new StackTracey().clean().at(1);
        const log = this.logger.configure({
            locate: { where },
            tag: { level: 'info' },
            render: { consoleMethod: 'info' },
            'concat+': this.concatContext({ context, where }),
        });
        log(message);
    }

    warn(message: unknown, context?: string): void {
        const where = new StackTracey().clean().at(1);
        const log = this.logger.configure({
            locate: { where },
            tag: { level: 'warn' },
            render: { consoleMethod: 'warn' },
            'concat+': this.concatContext({ context, where }),
        });
        log(message);
    }

    error(message: unknown, trace?: string, context?: string): void {
        const where = new StackTracey().clean().at(1);
        const log = this.logger.configure({
            locate: { where },
            tag: { level: 'error' },
            render: { consoleMethod: 'error' },
            'concat+': this.concatContext({ context, where }),
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
            locate: { where },
            tag: { level: 'debug' },
            render: { consoleMethod: 'debug' },
            'concat+': this.concatContext({ context, where }),
        });
        log(message);
    }

    private concatContext({ context, where }: { context?: string; where?: Entry }) {
        const { contextLimit, customLocatePosition, customLocateColumnLimit } =
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
                    context = stringify
                        .limit(context, contextLimit)
                        .padEnd(contextLimit);
                }
                lines = bullet(ansicolor.yellow(context + ' '), lines);
            }
            return lines;
        };
    }
}
