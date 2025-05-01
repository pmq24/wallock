import type { AppDexie } from 'models/dexie'
import Setting from './Setting'
import * as v from 'valibot'
import { createStandardError, createStandardSuccess } from 'models/common'
import { nanoid } from 'nanoid'

class SettingService {
  static SCHEMA = v.object(
    {
      timeZone: v.pipe(
        v.string(),
        v.values(Setting.TIME_ZONES, 'Invalid time zone')
      ),
    },
    'Missing details'
  )

  constructor (private dexie: AppDexie) {}

  async isCreated () {
    return !!(await this.dexie.settings.count())
  }

  async create (data: SettingService.CreateData) {
    if (await this.isCreated()) {
      return createStandardError({
        root: ['The setting has already been created'] as [string, ...string[]],
        nested: undefined,
        other: undefined,
      } as const)
    }

    const validation = v.safeParse(SettingService.SCHEMA, data)

    if (!validation.success) {
      const errors = v.flatten(validation.issues)
      return createStandardError(errors)
    }

    const id = await this.dexie.settings.add({
      id: nanoid(),
      timeZone: validation.output.timeZone as Setting.TimeZone,
    })

    return createStandardSuccess(id)
  }
}

namespace SettingService {
  export type CreateData = {
    timeZone: Setting.TimeZone;
  }
  export type CreateErrors = v.FlatErrors<typeof SettingService.SCHEMA>
}

export default SettingService
