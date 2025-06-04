module Sync
  class TransactionsController < ApplicationController
    rescue_from ActiveModel::ValidationError do |errors|
      render(json: errors.model.errors.to_hash, status: :bad_request)
    end

    def index
      summary = Sync::Transactions::Summary.new

      if summary.synced?(index_params[:hash])
        head(:no_content)
      else
        head(:conflict)
      end
    end

    def show
      block = Sync::Transactions::Block.new
      block.month = params[:id]
      synced = block.synced?(show_params[:hash])

      head(synced ? :no_content : :conflict)
    end

    private

    def index_params
      params.permit(:hash)
    end

    def show_params
      params.permit(:hash)
    end
  end
end
