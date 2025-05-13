export default class Transaction {
  constructor (params: {
    id: string;
    amount: number;
    categoryId: string;
    time: string;
    walletId: string;
  }) {
    this.id = params.id
    this.amount = params.amount
    this.time = params.time
    this.categoryId = params.categoryId
    this.walletId = params.walletId
  }

  public readonly id: string
  public readonly amount: number
  public readonly time: string
  public readonly categoryId: string
  public readonly walletId: string
}
