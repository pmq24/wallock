import VaultService from './vaults/VaultService'
import type AuthService from './auth/AuthService'

export default class SyncService {
  constructor (params: {
    vaultService: VaultService;
    authService: AuthService;
  }) {
    this.vaultService = params.vaultService
    this.authService = params.authService
  }

  private readonly vaultService: VaultService
  private readonly authService: AuthService
}
