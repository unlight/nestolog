import ansicolor from 'ansicolor';
import { expect, it, vi } from 'vitest';

import { messageColumnWidth } from './message-column-width';
import { NestologOptions, nestologOptionsDefaults } from './nestolog-options';
import { NestoLogger } from './nestologger.service';

function createOutput(
    options: Partial<
        NestologOptions & {
            message?: string | Error;
            context?: string;
            method: 'log' | 'warn' | 'error' | 'debug';
            trace?: string;
        }
    > = {},
) {
    let output = '';
    const message = options.message ?? 'Test Message';
    const context = options.context ?? 'Context';
    const logger = new NestoLogger({
        ...nestologOptionsDefaults,
        ...options,
        render: (input: string) => {
            output = ansicolor.strip(input);
        },
    });
    const method = options.method ?? 'log';
    if (logger[method].length === 2) logger[method](message, context);
    else if (logger[method].length === 3)
        logger[method](message, options.trace, context);
    return output;
}

it('log', () => {
    const output = createOutput({});
    expect(output).toMatch('INFO\t');
});

it('messageColumnWidth', () => {
    const result = messageColumnWidth(nestologOptionsDefaults);
    expect(result).not.toBeUndefined();
});

it('custom locate bottom', () => {
    const output = createOutput({
        customLocate: true,
        customLocatePosition: 'bottom',
    });
    const lines = output.split('\n');
    expect(lines).toHaveLength(2);
    expect(lines[0]!.indexOf('Test Message')).toEqual(
        lines[1]?.indexOf('createOutput'),
    );
});

it('custom locate column', () => {
    const output = createOutput({
        customLocate: true,
        customLocatePosition: 'column',
    });
    const lines = output.split('\n');
    expect(lines).toHaveLength(1);
    expect(output).toContain('Context       index.spec.ts');
});

it('custom locate context', () => {
    let output = createOutput({
        customLocate: true,
        customLocatePosition: 'context',
        context: '',
        contextLimit: 80,
    });
    output = output.replace(/\s+/g, ' ');
    expect(output).toContain('INFO createOutput @ index.spec.ts');
});

it('warn', () => {
    const output = createOutput({ method: 'warn' });
    expect(output).toMatch('WARN\t');
});

it('error', () => {
    const output = createOutput({ method: 'error' });
    expect(output).toMatch('ERROR\t');
});

it('debug', () => {
    const output = createOutput({ method: 'debug' });
    expect(output).toMatch('DEBUG\t');
});

it('timeFormat', () => {
    vi.useFakeTimers();

    vi.setSystemTime(new Date(2000, 1, 1, 10, 42, 56));

    const output = createOutput({
        timeFormat: '{HH}:{mm}:{ss}',
    });
    expect(output).toContain('10:42:56');

    vi.useRealTimers();
});

it('error stack trace', () => {
    const output = createOutput({
        method: 'error',
        message: new Error('foo'),
    });

    console.log('output', output);
});
