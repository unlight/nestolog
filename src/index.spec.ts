import expect from 'expect';

import { messageColumnWidth } from './message-column-width';
import { nestologOptionsDefaults } from './nestolog-options.provider';

describe('nestoLog', () => {
    it('configure messageColumnWidth temp', () => {
        const result = messageColumnWidth(nestologOptionsDefaults);
        expect(result).not.toBeUndefined();
    });
});
