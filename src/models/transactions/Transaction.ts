export default class Transaction {
  constructor (
    public readonly id: string,
    public readonly amount: number,
    public readonly categoryId: string,
    public readonly timestamp: number,
    public readonly walletId: string
  ) {}
}
