import ololog from 'ololog';

import { Entry } from './types';

export const nestologOptionsDefaults = {
    time: true,
    locate: true,
    tag: true,
    contextLimit: 13,
    /**
     * Word wrap width for message.
     * If 0 (default) tries to auto detect.
     * If -1 disable
     */
    messageColumnWidth: 0,
    /**
     * Alternative locate. Default ololog's locate add callee info to the last non-empty string
     * Custom locate add callee info on next new line.
     */
    customLocate: undefined as undefined | boolean | typeof customLocateDefault,
};

export type NestologOptions = Partial<
    typeof nestologOptionsDefaults & Parameters<typeof ololog.configure>[0]
>;

export function customLocateDefault({ calleeShort, fileName, line }: Entry): string {
    let result = '';
    if (calleeShort) {
        result += calleeShort;
    }
    if (fileName && line) {
        if (result.length > 0) {
            result += ' @ ';
        }
        result += fileName;
        result += ':';
        result += line;
    }
    return result;
}
