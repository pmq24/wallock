function forceObject<T extends Record<string, unknown>>(v: unknown) {
  return typeof v === 'object' && v !== null ? v as T : {} as Partial<T>
}

const Util = {
  forceObject,
}
export default Util


