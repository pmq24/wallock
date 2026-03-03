namespace Util {
  export type Result<TData, TError> =
    | Readonly<{ ok: true; data: TData }>
    | Readonly<{ ok: false; error: TError }>
}

const Util = {
}

export default Util
