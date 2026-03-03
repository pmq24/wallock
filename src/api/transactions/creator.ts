import Util from "@/api/util"

export default class Creator {
  newCreateObject(): CreateObject {
    return {
      amount: 0,
      time: Date.now(),
      categoryid: 0,
      walletid: 0,
    }
  }

  async validate(obj: CreateObject) {
  }
}

export type CreateObject = {
  amount: number
  time: number
  categoryid: number
  walletid: number
}

export type CreateResult = CreateSuccessResult | CreateErrorResult

export type CreateSuccessResult = {
  ok: true,
  data: CreateObject
}

export type CreateErrorResult = {
  ok: false,
  errors: Partial<Record<keyof CreateObject, string>>
}
