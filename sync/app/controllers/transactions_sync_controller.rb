class TransactionsSyncController < ApplicationController
  def pull_to_local
    transactions_to_pull = transactions_sync.pull_to_local(local_hashes)

    render(json: transactions_to_pull, status: :ok)
  end

  def different_from_remote
    different_hashes = transactions_sync.diff(local_hashes)

    render(json: different_hashes, status: :ok)
  end

  def push_to_remote
    transactions_sync.push_to_remote(push_to_remote_params)
    render(status: :no_content)
  end

  private

  def push_to_remote_params
    @push_to_remote_params ||= params
      .require(:_json)
      .map { |params| params.permit([ :id, :time, :amount, :category_id, :wallet_id, :hash ]) }
  end

  def local_hashes
    @local_hashes ||= params.require(:hashes)&.split(" ")
  end

  def transactions_sync
    @transactions_sync ||= Sync::TransactionsSync.new
  end
end
