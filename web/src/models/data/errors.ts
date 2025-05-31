export class ValidationError<T extends object> extends Error {
  constructor (messages: Record<keyof T, string | undefined>) {
    super('ValidationError')
    this.messages = messages
  }

  readonly messages: Record<keyof T, string | undefined>
}

export class NotFoundError extends Error {
  constructor (resourceName: string, id: string) {
    super(`Cannot find ${resourceName} with id ${id}`)
  }
}
