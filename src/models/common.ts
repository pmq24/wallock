export function createStandardSuccess<T extends unknown> (data: T) {
  return {
    success: true,
    data,
    errors: undefined,
  }
}

export function createStandardError<T extends unknown> (errors: T) {
  return {
    success: false,
    data: undefined,
    errors,
  }
}
