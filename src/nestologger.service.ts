import { Inject, Injectable, LoggerService, Optional } from '@nestjs/common';
import ansicolor from 'ansicolor';
import ololog from 'ololog';
import StackTracey from 'stacktracey';
import bullet from 'string.bullet';
import stringify from 'string.ify';
import wrapAnsi from 'wrap-ansi';

import { messageColumnWidth } from './message-column-width';
import { NESTOLOG_OPTIONS, NestologOptions } from './nestolog-options.provider';

// ololog pipeline: stringify trim lines concat indent tag time locate join render returnValue

@Injectable()
export class NestoLogger implements LoggerService {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    verbose = this.debug;

    constructor(
        @Inject(NESTOLOG_OPTIONS) private readonly options: Required<NestologOptions>,
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
                '+lines': (lines: string[]) => {
                    lines = lines.map(line => wrapAnsi(line, width, { trim: false }));
                    return lines;
                },
            });
        }
        return logger;
    }

    log(message: any, context?: string): void {
        const log = this.logger.configure({
            locate: {
                where: new StackTracey().clean().at(1),
            },
            tag: { level: 'info' },
            render: { consoleMethod: 'info' },
            'concat+': this.concatContext(context),
        });
        log(message);
    }

    warn(message: any, context?: string): void {
        const log = this.logger.configure({
            locate: {
                where: new StackTracey().clean().at(1),
            },
            tag: { level: 'warn' },
            render: { consoleMethod: 'warn' },
            'concat+': this.concatContext(context),
        });
        log(message);
    }

    error(message: any, trace?: string, context?: string): void {
        const log = this.logger.configure({
            locate: {
                where: new StackTracey().clean().at(1),
            },
            tag: { level: 'error' },
            render: { consoleMethod: 'error' },
            'concat+': this.concatContext(context),
        });
        if (!trace && message instanceof Error && !message.stack) {
            Error.captureStackTrace(message);
        }
        log(message);
        if (trace) {
            log(trace);
        }
    }

    debug(message: any, context?: string): void {
        const log = this.logger.configure({
            locate: {
                where: new StackTracey().clean().at(1),
            },
            tag: { level: 'debug' },
            render: { consoleMethod: 'debug' },
            'concat+': this.concatContext(context),
        });
        log(message);
    }

    private concatContext(context: string | undefined) {
        const contextLimit = this.options.contextLimit;
        if (!(context && contextLimit > 0)) {
            return;
        }
        // eslint-disable-next-line consistent-return
        return (lines: string[]) => {
            context = stringify.limit(context, contextLimit).padEnd(contextLimit);
            return bullet(ansicolor.yellow(context + ' '), lines) as string;
        };
    }
}
