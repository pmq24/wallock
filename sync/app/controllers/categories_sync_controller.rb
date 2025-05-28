class CategoriesSyncController < ApplicationController
  include UpdateHashCsv

  def hash
    hash_csv = google_drive.get_or_create_file_as_csv("hash.csv")
    hash = hash_csv.find { |row| row["name"] == "categories" }&.hash
    render(json: hash || "", status: :ok)
  end

  def pull_to_local
    categories_to_pull = categories_sync.pull_to_local(local_hashes)

    render(json: categories_to_pull, status: :ok)
  end

  def different_from_remote
    different_hashes = categories_sync.diff(local_hashes)

    render(json: different_hashes, status: :ok)
  end

  def push_to_remote
    categories_sync.push_to_remote(push_to_remote_params[:categories])
    render(status: :no_content)
  end

  private

  def push_to_remote_params
    @push_to_remote_params ||= params
      .require(:categories_sync)
      .permit(categories: [ :id, :name, :type, :hash ])
  end

  def local_hashes
    @local_hashes ||= params.require(:hashes)&.split(" ")
  end

  def categories_sync
    @categories_sync ||= Sync::CategoriesSync.new
  end
end
