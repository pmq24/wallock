import { createStandardError, createStandardSuccess } from 'models/common'
import type { VaultTable } from './dexie'
import * as v from 'valibot'
import { nanoid } from 'nanoid'
import Vault from './Vault'
import type AuthService from '../auth/AuthService'

class VaultService {
  constructor (params: { vaultTable: VaultTable; authService: AuthService }) {
    this.vaultTable = params.vaultTable
    this.authService = params.authService
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

  async getRemote () {
    const vault = await this.get()
    if (!vault) return undefined

    const res = await this.authService.fetchSyncApp(
      `/vaults/${vault.remoteId}`
    )
    const payload: { id: string; name: string; url: string } = await res.json()
    payload.url = `https://drive.google.com/drive/folders/${payload.id}`
    return payload
  }

  async create (data: VaultService.CreateData) {
    const alreadyExists = await this.get()
    if (alreadyExists) {
      return createStandardError({
        root: ['Already exists' as const] as const,
      })
    }

    data.name ||= 'Wallock'

    const res = await this.authService.fetchSyncApp('/vaults', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    let payload
    payload = await res.json()
    const schema = v.object({
      id: v.pipe(v.string(), v.minLength(1)),
    })
    const result = v.safeParse(schema, payload)
    if (!result.success) {
      throw new Error('Sync App: POST /vaults/ has changed API schema')
    }

    payload = result.output
    const id = await this.createRecord({
      remoteId: payload.id,
    })

    return createStandardSuccess(id)
  }

  get schema () {
    return v.object({
      remoteId: v.pipe(v.string(), v.minLength(1)),
    })
  }

  private async createRecord (data: VaultService.CreateRecordData) {
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

  private readonly vaultTable: VaultTable
  private readonly authService: AuthService
}

namespace VaultService {
  export type CreateData = {
    name: string;
  }
  export type CreateRecordData = {
    remoteId: string;
  }
}

export default VaultService
