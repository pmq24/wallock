import type SyncApp from './SyncApp'
import * as v from 'valibot'

export default class RootFolderService {
  constructor (params: { syncApp: SyncApp }) {
    this.syncApp = params.syncApp
  }

  async get () {
    const { payload } = await this.syncApp.fetch('/root_folder')

    return this.checkRootFolderResponseCheck(payload)
  }

  private checkRootFolderResponseCheck (payload: unknown) {
    const schema = v.object({
      id: v.pipe(v.string(), v.minLength(1)),
      name: v.pipe(v.string(), v.minLength(1)),
    })

    return v.parse(schema, payload)
  }

  private readonly syncApp: SyncApp
}
