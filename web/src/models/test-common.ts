import { IDBFactory, IDBKeyRange } from 'fake-indexeddb'
import { createAppDexie } from './dexie'

export function mockDexie () {
  return createAppDexie({ indexedDB: new IDBFactory(), IDBKeyRange })
}

export const descriptionFor = {
  class (name: string) {
    return 'Class: ' + name
  },
  member<T extends unknown>(name: keyof T) {
    return 'Member: ' + String(name)
  },
  method (name: string) {
    return 'Method: ' + name
  },
  scenario (description: string) {
    return 'When: ' + description
  },
  returns (description?: string) {
    if (description) {
      return 'Returns: ' + description
    } else {
      return 'Returned data:'
    }
  }

} as const
