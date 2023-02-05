import * as Token from 'token-types';
import { IGetToken } from 'strtok3/core';

/**
 * 6.2 Identification Header
 * Ref: https://theora.org/doc/Theora.pdf: 6.2 Identification Header Decode
 */
export interface IIdentificationHeader {
  // Signature: 0x80 + 'theora'
  id: string,
  // The major version number
  vmaj: number,
  // The minor version number
  vmin: number,
  // The version revision number.
  vrev: number,
  // The width of the frame in macro blocks
  vmbw: number,
  // The height of the frame in macro blocks
  vmbh: number,
  // The nominal bitrate of the stream, in bits per second.
  nombr: number,
  // The quality hint.
  nqual: number,
}

/**
 * 6.2 Identification Header
 * Ref: https://theora.org/doc/Theora.pdf: 6.2 Identification Header Decode
 */
export const IdentificationHeader: IGetToken<IIdentificationHeader> = {
  len: 42,

  get: (buf: Uint8Array, off): IIdentificationHeader => {
    const view = new DataView(buf.buffer);
    //view.getUint16(off + 10)
    return {
      id: new Token.StringType(7, 'ascii').get(buf, off),
      vmaj: view.getUint8(off + 7),
      vmin: view.getUint8(off + 8),
      vrev: view.getUint8(off + 9),
      vmbw: view.getUint16(off + 10, false),
      vmbh: view.getUint16(off + 17, false),
      nombr: Token.UINT24_BE.get(buf, off + 37),
      nqual: view.getUint8(off + 40)
    };
  }
};
