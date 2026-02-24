import type Fetcher from './fetcher'
import * as v from 'valibot'
import i18n from '@/i18n'

export default class Validator {
  constructor(opts: { fetcher: Fetcher }) {
    this.fetcher = opts.fetcher
  }

  validate(opts: { name: string; parentId?: number }) {
    const categories = this.fetcher.all()
    const siblingNames = categories
      .filter((c) => c.parentId === opts.parentId)
      .map((c) => c.name.trim())
    const ids = new Set(categories.map((c) => c.id))

    const schema = v.object({
      name: v.pipe(
        v.string(),
        v.trim(),
        v.minLength(1),
        v.notValues(siblingNames, i18n.t('categories.props.name.errors.alreadyExists')),
      ),
      parentId: v.pipe(
        v.number(),
        v.integer(),
        v.check((id) => ids.has(id), i18n.t('categories.props.parent.errors.notFound')),
      ),
    })

    const result = v.safeParse(schema, opts)
    if (result.success) {
      return { ok: true, data: result.output } as const
    } else {
      const error = v.flatten(result.issues)
      return { ok: false, error } as const
    }
  }

  private readonly fetcher: Fetcher
}
