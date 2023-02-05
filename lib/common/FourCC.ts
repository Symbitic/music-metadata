import { IToken } from 'strtok3/core';

import * as util from './Util.js';

const validFourCC = /^[\x21-\x7e©][\x20-\x7e\x00()]{3}/;

/**
 * Token for read FourCC
 * Ref: https://en.wikipedia.org/wiki/FourCC
 */
export const FourCcToken: IToken<string> = {
  len: 4,

  get: (buf: Uint8Array, off: number): string => {
    const id = util.convertToBinaryString(buf, off, off + FourCcToken.len);
    if (!id.match(validFourCC)) {
      throw new Error(`FourCC contains invalid characters: ${util.a2hex(id)} "${id}"`);
    }
    return id;
  },

  put: (buffer: Uint8Array, offset: number, id: string) => {
    const buf = new TextEncoder().encode(id);
    if (buf.length !== 4)
      throw new Error('Invalid length');
    buffer.set(buf, offset);
    return buf.length;
  }
};
