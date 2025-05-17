import bencode from 'bencode'
import { Base64 } from 'js-base64'

export default class Hasher {
  async hashData (data: Omit<Record<string, any>, 'hash'>) {
    const bencoded = bencode.encode(data)
    const sha256 = await window.crypto.subtle.digest('SHA-256', bencoded)
    return Base64.fromUint8Array(new Uint8Array(sha256))
  }

  async hashDataCollection (collection: { hash: string }[]) {
    const joined = collection
      .map((item) => item.hash)
      .sort()
      .join(' ')
    const sha256 = await window.crypto.subtle.digest(
      'SHA-256',
      this.textEncoder.encode(joined)
    )

    return Base64.fromUint8Array(new Uint8Array(sha256))
  }

  private readonly textEncoder = new TextEncoder()
}
