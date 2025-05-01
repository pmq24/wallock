import Dexie, { type DexieOptions, type EntityTable } from 'dexie'
import Setting from 'models/settings/Setting'

export function createAppDexie (opts?: DexieOptions) {
  const d = new Dexie('Wallock Database', opts) as AppDexie

  d.version(1).stores({
    settings: 'id',
  })

  return d
}

export type AppDexie = Dexie & {
  settings: SettingTable;
}

export type SettingTable = EntityTable<SettingRecord, 'id'>
export type SettingRecord = {
  id: string;
  timeZone: Setting.TimeZone;
}
