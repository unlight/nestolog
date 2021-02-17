import ansicolor from 'ansicolor';
import expect from 'expect';

import { messageColumnWidth } from './message-column-width';
import { nestologOptionsDefaults } from './nestolog-options.provider';
import { NestoLogger } from './nestologger.service';

it('messageColumnWidth', () => {
    const result = messageColumnWidth(nestologOptionsDefaults);
    expect(result).not.toBeUndefined();
});

it('custom locate', () => {
    let output = '';
    const logger = new NestoLogger({
        ...nestologOptionsDefaults,
        customLocate: true,
        render: (input: string) => {
            output = ansicolor.strip(input);
        },
    });
    logger.log('Test message', 'Contex');
    const lines = output.split('\n');
    expect(lines).toHaveLength(2);
    expect(lines[0]!.indexOf('Test message')).toEqual(lines[1]?.indexOf('<anonymous>'));
});
