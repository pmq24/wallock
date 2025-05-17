export function createStandardSuccess<T extends unknown> (data: T) {
  return {
    success: true as const,
    data,
    errors: undefined,
  }
}

export function createStandardError<T extends unknown> (errors: T) {
  return {
    success: false as const,
    data: undefined,
    errors,
  }
}
