class WalletsSyncController < ApplicationController
  def pull_to_local
    wallets_to_pull = wallets_sync.pull_to_local(local_hashes)

    render(json: wallets_to_pull, status: :ok)
  end

  def different_from_remote
    different_hashes = wallets_sync.diff(local_hashes)

    render(json: different_hashes, status: :ok)
  end

  def push_to_remote
    wallets_sync.push_to_remote(push_to_remote_params)
    render(status: :no_content)
  end

  private

  def push_to_remote_params
    @push_to_remote_params ||= params
      .require(:_json)
      .map { |params| params.permit([ :id, :name, :currency_code, :is_default, :hash ]) }
  end

  def local_hashes
    @local_hashes ||= params.require(:hashes)&.split(" ")
  end

  def wallets_sync
    @wallets_sync ||= Sync::WalletsSync.new
  end
end
