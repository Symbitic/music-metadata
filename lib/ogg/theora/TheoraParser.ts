import { ITokenizer } from 'strtok3/core';
import initDebug from 'debug';

import * as Ogg from '../Ogg.js';
import { IOptions } from '../../type.js';
import { INativeMetadataCollector } from '../../common/MetadataCollector.js';
import { IdentificationHeader } from './Theora.js';

const debug = initDebug('music-metadata:parser:ogg:theora');

/**
 * Ref:
 * - https://theora.org/doc/Theora.pdf
 */
export class TheoraParser implements Ogg.IPageConsumer {

  constructor(private metadata: INativeMetadataCollector, options: IOptions, private tokenizer: ITokenizer) {
  }

  /**
   * Vorbis 1 parser
   * @param header Ogg Page Header
   * @param pageData Page data
   */
  public parsePage(header: Ogg.IPageHeader, pageData: Uint8Array) {
    if (header.headerType.firstPage) {
      this.parseFirstPage(header, pageData);
    }
  }

  public flush() {
    debug('flush');
  }

  public calculateDuration(header: Ogg.IPageHeader) {
    debug('duration calculation not implemented');
  }

  /**
   * Parse first Theora Ogg page. the initial identification header packet
   * @param {IPageHeader} header
   * @param {Uint8Array} pageData
   */
  protected parseFirstPage(header: Ogg.IPageHeader, pageData: Uint8Array) {
    debug('First Ogg/Theora page');
    this.metadata.setFormat('codec', 'Theora');
    const idHeader = IdentificationHeader.get(pageData, 0);
    this.metadata.setFormat('bitrate', idHeader.nombr);
  }

}
