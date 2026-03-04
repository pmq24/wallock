namespace Util {
  export type Result<TData, TError> =
    | Readonly<{ ok: true; data: TData, error: undefined }>
    | Readonly<{ ok: false; error: TError, data: undefined }>
}

const Util = {
}

export default Util
