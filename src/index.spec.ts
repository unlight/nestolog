import expect from 'expect';

import { messageColumnWidth } from './message-column-width';
import { nestologOptionsDefaults } from './nestolog-options.provider';
import { NestoLogger } from './nestologger.service';

describe('nestoLog', () => {
    it('configure messageColumnWidth temp', () => {
        const result = messageColumnWidth(nestologOptionsDefaults);
        expect(result).not.toBeUndefined();
    });

    it('smoke', () => {
        const logger = new NestoLogger(nestologOptionsDefaults!);
        logger.log('Test message\nOK');
    });
});
