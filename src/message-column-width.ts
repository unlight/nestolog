import ansicolor from 'ansicolor';
import ololog from 'ololog';
import termSize from 'term-size';

import { NestologOptions } from './nestolog-options';

export function messageColumnWidth(
  options: NestologOptions,
  log: ololog = ololog.configure(options),
): number {
  const {
    contextLimit = 0,
    customLocateColumnLimit,
    customLocatePosition,
  } = options;
  let result = 0;
  log = log.configure({
    render: (input: string) => {
      result =
        termSize().columns -
        ansicolor.strip(input).replace(/\t/g, ' '.repeat(4)).length -
        (Math.max(0, contextLimit) || 0);
      if (customLocatePosition === 'column') {
        result -= customLocateColumnLimit;
      }
      result = Math.max(0, result) || 0;
    },
  });

  log.info('');

  return result;
}
