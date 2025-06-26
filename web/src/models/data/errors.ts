export class ValidationError<T extends object> extends Error {
  constructor () {
    super('ValidationError')
  }

  setMultiple (errors?: { [field in keyof T]?: string | string[]; }) {
    if (!errors) return

    for (const [field, message] of Object.entries(errors)) {
      this.set(field as keyof T, message as string | string[] | undefined)
    }
  }

  set (field: keyof T, message?: string | string[]) {
    if (!message) return

    if (!Array.isArray(message)) {
      this.messages[field] = message
      return
    }

    if (message.length > 0) {
      this.messages[field] = message.at(0)
    }
  }

  get (field: keyof T) {
    return this.messages[field]
  }

  readonly messages: { [field in keyof T]?: string; } = {}
}

export class NotFoundError extends Error {
  constructor (resourceName: string, id: string) {
    super(`Cannot find ${resourceName} with id ${id}`)
  }
}
