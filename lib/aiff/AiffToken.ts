import * as Token from 'token-types';
import { FourCcToken } from '../common/FourCC.js';
import * as iff from '../iff/index.js';

import { IGetToken } from 'strtok3';

/**
 * The Common Chunk.
 * Describes fundamental parameters of the waveform data such as sample rate, bit resolution, and how many channels of
 * digital audio are stored in the FORM AIFF.
 */
export interface ICommon {
  numChannels: number,
  numSampleFrames: number,
  sampleSize: number,
  sampleRate: number,
  compressionType?: string,
  compressionName?: string
}

export class Common implements IGetToken<ICommon> {

  public len: number;

  public constructor(header: iff.IChunkHeader, private isAifc: boolean) {
    const minimumChunkSize = isAifc ? 22 : 18;
    if (header.chunkSize < minimumChunkSize) throw new Error(`COMMON CHUNK size should always be at least ${minimumChunkSize}`);
    this.len = header.chunkSize;
  }

  public get(buf: Uint8Array, off: number): ICommon {

    //new DataView(data.buffer).getInt16(offset, true)
    const view = new DataView(buf.buffer);

    // see: https://cycling74.com/forums/aiffs-80-bit-sample-rate-value
    // view.getUint16(off + 8)
    const shift = view.getUint16(off + 8) - 16398;
    const baseSampleRate = view.getUint16(off + 8 + 2);

    const res: ICommon = {
      numChannels: view.getUint16(off),
      numSampleFrames: view.getUint16(off + 2),
      sampleSize: view.getUint16(off + 6),
      sampleRate: shift < 0 ? baseSampleRate >> Math.abs(shift) : baseSampleRate << shift
    };

    if (this.isAifc) {
      res.compressionType = FourCcToken.get(buf, off + 18);
      if (this.len > 22) {
        const strLen = view.getInt8(off + 22);
        if (strLen > 0) {
          const padding = (strLen + 1) % 2;
          if (23 + strLen + padding === this.len) {
            res.compressionName = new Token.StringType(strLen, 'binary').get(buf, off + 23);
          } else {
            throw new Error('Illegal pstring length');
          }
        } else {
          res.compressionName = undefined;
        }
      }
    } else {
      res.compressionName = 'PCM';
    }

    return res;
  }
}
