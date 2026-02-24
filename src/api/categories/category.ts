import type Fetcher from './fetcher'

export type CategoryOptions = {
  id: number
  name: string
  parentId?: number
  readonly: boolean

  fetcher: Fetcher
}

export default class Category {
  constructor(options: CategoryOptions) {
    this.id = options.id
    this.name = options.name
    this.parentId = options.parentId
    this.readonly = options.readonly

    this.fetcher = options.fetcher
  }

  get parent(): Category | undefined {
    if (this.parentId === undefined) {
      return undefined
    } else {
      return this.fetcher.byId(this.parentId)
    }
  }

  readonly id: number
  readonly name: string
  readonly parentId?: number
  readonly readonly: boolean

  readonly fetcher: Fetcher
}
