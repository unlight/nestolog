import bullet_ from 'string.bullet';
import stringify_ from 'string.ify';

interface Stringify {
  limit(s: string, n: number): string;
}

type StringBullet = (bullet: string, argument: string | string[]) => string[];

export const stringify = stringify_ as Stringify;
export const bullet = bullet_ as StringBullet;
