import { createStandardError, createStandardSuccess } from 'models/common'
import type { VaultTable } from './dexie'
import * as v from 'valibot'
import { nanoid } from 'nanoid'
import Vault from './Vault'

class VaultService {
  constructor (params: { vaultTable: VaultTable }) {
    this.vaultTable = params.vaultTable
  }

  async get () {
    const records = await this.vaultTable.toArray()
    const record = records.at(0)

    if (record) {
      return new Vault(record)
    } else {
      return undefined
    }
  }

  async create (data: VaultService.CreateData) {
    const validation = v.safeParse(this.schema, data)

    if (!validation.success) {
      const errors = v.flatten(validation.issues)
      return createStandardError(errors)
    }

    const id = await this.vaultTable.add({
      id: nanoid(),
      ...validation.output,
    })

    return createStandardSuccess(id)
  }

  get schema () {
    return v.object({
      remoteId: v.pipe(v.string(), v.minLength(1)),
    })
  }

  private readonly vaultTable: VaultTable
}

namespace VaultService {
  export type CreateData = {
    remoteId: string;
  }
}

export default VaultService
