import type WalletService from '../WalletService'

export async function mockWallets (walletService: WalletService) {
  const mockData: WalletService.CreateData[] = [
    { name: 'Day-to-day', currencyCode: 'USD' },
    { name: 'Saving', currencyCode: 'USD' },
  ]

  for (const data of mockData) {
    const result = await walletService.create(data)

    if (!result.success) {
      throw new Error(`Failed to mock wallets: ${result.errors}`)
    }
  }
}
