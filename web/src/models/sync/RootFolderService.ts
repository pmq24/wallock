import type AuthService from './AuthService'

export default class RootFolderService {
  constructor (params: { authService: AuthService }) {
    this.authService = params.authService
  }

  async get (): Promise<{ id: string; name: string }> {
    // TODO: handle unauthorized case
    const res = await this.authService.fetchSyncApp('/root_folder')
    return await res.json()
  }

  private readonly authService: AuthService
}
