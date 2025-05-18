import bencode from 'bencode'
import { Base64 } from 'js-base64'
import jsSha256 from 'js-sha256'

export default class Hasher {
  hashData (data: Omit<Record<string, any>, 'hash'>) {
    const bencoded = bencode.encode(data)

    const sha256 = jsSha256.sha256(bencoded)
    return Base64.fromUint8Array(
      new Uint8Array(this.textEncoder.encode(sha256))
    )
  }

  hashDataCollection (collection: { hash: string }[]) {
    const joined = collection
      .map((item) => item.hash)
      .sort()
      .join(' ')
    const sha256 = jsSha256.sha256(joined)

    return Base64.fromUint8Array(
      new Uint8Array(this.textEncoder.encode(sha256))
    )
  }

  private readonly textEncoder = new TextEncoder()
}
