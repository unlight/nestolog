import ololog from 'ololog';

import { Entry } from './types';

export type NestologOptions = typeof nestologOptionsDefaults &
  Parameters<typeof ololog.configure>[0];

export const nestologOptionsDefaults = {
  /**
   * Limit of context message.
   */
  contextLimit: 13,
  /**
   * Alternative locate. Default ololog's locate add callee info to the last non-empty string
   * Custom locate add callee info on next new line.
   */
  customLocate: undefined as undefined | boolean | typeof customLocateDefault,
  /**
   * Limit callee info length in case of customLocatePosition = 'column'
   */
  customLocateColumnLimit: 30,
  /**
   * Place of callee info.
   * 'bottom' - next on new line (default)
   * 'column' - between tag and message columnized
   * 'context' - in context column if context is empty
   */
  customLocatePosition: 'bottom' as 'bottom' | 'column' | 'context',
  locate: true,
  /**
   * Word wrap width for message.
   * If 0 (default) tries to auto detect.
   * If -1 disable
   */
  messageColumnWidth: 0,
  tag: true,
  time: true,
  /**
   * Format date using https://github.com/lukeed/tinydate
   */
  timeFormat: undefined as undefined | string,
};

export function customLocateDefault(
  { calleeShort, fileName, line }: Entry,
  options: NestologOptions,
): string {
  const { customLocateColumnLimit, customLocatePosition } = options;
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
  if (
    customLocatePosition === 'column' &&
    result.length > customLocateColumnLimit &&
    fileName &&
    line
  ) {
    result = `${fileName}:${line}`;
  }
  return result;
}
