import * as Token from 'token-types';
import { IGetToken } from 'strtok3/core';

import * as util from '../../common/Util.js';

/**
 * Speex Header Packet
 * Ref: https://www.speex.org/docs/manual/speex-manual/node8.html#SECTION00830000000000000000
 */
export interface IHeader {
  /**
   * speex_string, char[] 8
   */
  speex: string,
  /**
   * speex_version, char[] 20
   */
  version: string,
  /**
   * Version id
   */
  version_id: number,
  header_size: number,
  rate: number,
  mode: number,
  mode_bitstream_version: number,
  nb_channels: number,
  bitrate: number,
  frame_size: number,
  vbr: number,
  frames_per_packet: number,
  extra_headers: number,
  reserved1: number,
  reserved2: number
}

/**
 * Speex Header Packet
 * Ref: https://www.speex.org/docs/manual/speex-manual/node8.html#SECTION00830000000000000000
 */
export const Header: IGetToken<IHeader> = {

  len: 80,

  get: (buf: Uint8Array, off) => {
    const view = new DataView(buf.buffer);
    //view.getInt32(off + 36, true)
    return {
      speex: new Token.StringType(8, 'ascii').get(buf, off + 0),
      version: util.trimRightNull(new Token.StringType(20, 'ascii').get(buf, off + 8)),
      version_id: view.getInt32(off + 28, true),
      header_size: view.getInt32(off + 32, true),
      rate: view.getInt32(off + 36, true),
      mode: view.getInt32(off + 40, true),
      mode_bitstream_version: view.getInt32(off + 44, true),
      nb_channels: view.getInt32(off + 48, true),
      bitrate: view.getInt32(off + 52, true),
      frame_size: view.getInt32(off + 56, true),
      vbr: view.getInt32(off + 60, true),
      frames_per_packet: view.getInt32(off + 64, true),
      extra_headers: view.getInt32(off + 68, true),
      reserved1: view.getInt32(off + 72, true),
      reserved2: view.getInt32(off + 76, true)
    };
  }
};
