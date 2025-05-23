import bencode from 'bencode'
import { sha1 } from 'js-sha1'

export default class Hasher {
  hashData (data: Omit<Record<string, any>, 'hash'>) {
    const bencoded = bencode.encode(data)

    return sha1(bencoded)
  }

  hashDataCollection (collection: { hash: string }[]) {
    const joined = collection
      .map((item) => item.hash)
      .sort()
      .join(' ')
    return sha1(joined)
  }
}
