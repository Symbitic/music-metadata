import { IRandomReader } from '../type.js';
import * as util from "../common/Util.js";

export const endTag2 = 'LYRICS200';

export async function getLyricsHeaderLength(reader: IRandomReader): Promise<number> {
  if (reader.fileSize >= 143) {
    const buf = new Uint8Array(15);
    await reader.randomRead(buf, 0, buf.length, reader.fileSize - 143);
    const txt = util.convertToBinaryString(buf);
    const tag = txt.substr(6);
    if (tag === endTag2) {
      return parseInt(txt.substr(0, 6), 10) + 15;
    }
  }
  return 0;
}
