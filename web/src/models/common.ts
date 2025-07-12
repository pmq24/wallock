export function createStandardSuccess<T extends unknown> (data: T) {
  return {
    success: true as const,
    data,
    errors: undefined,
  } as const
}

export function createStandardError<T extends unknown> (errors: T) {
  return {
    success: false as const,
    data: undefined,
    errors,
  } as const
}

export class PanicError extends Error {}
