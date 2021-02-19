import ansicolor from 'ansicolor';
import expect from 'expect';

import { messageColumnWidth } from './message-column-width';
import { NestologOptions, nestologOptionsDefaults } from './nestolog-options';
import { NestoLogger } from './nestologger.service';

function createOutput(
    options: Partial<NestologOptions & { message?: string; context?: string }> = {},
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
    logger.log(message, context);
    return output;
}

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
