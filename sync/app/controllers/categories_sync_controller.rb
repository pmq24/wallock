class CategoriesSyncController < ApplicationController
  include UpdateHashCsv

  def hash
    hash_csv = google_drive.get_or_create_file_as_csv("hash.csv")
    hash = hash_csv.find { |row| row["name"] == "categories" }&.hash
    render(json: hash || "", status: :ok)
  end

  def pull_to_local
    hashes_to_pull = remote_hashes - local_hashes
    categories_to_pull = categories_csv.filter { |row| hashes_to_pull.include?(row["hash"]) }

    render(json: categories_to_pull, status: :ok)
  end

  def different_from_remote
    different_hashes = local_hashes - remote_hashes

    render(json: different_hashes, status: :ok)
  end

  def push_to_remote
    push_to_remote_params[:categories]
      .each do |category|
        categories_csv << CSV::Row.new(
          GoogleDrive::CATEGORIES_CSV_HEADERS,
          [ category[:id], category[:type], category[:name], category[:hash] ]
        )
      end

    sorted = CSV::Table.new(categories_csv.sort_by { |row| [ row["type"], row["name"] ] })

    google_drive.update_file("categories.csv", sorted)

    update_hash_csv

    render(status: :no_content)
  end

  private

  def push_to_remote_params
    @push_to_remote_params ||= params.require(:categories_sync).permit(categories: [ :id, :name, :type, :hash ])
  end

  def local_hashes
    @local_hashes ||= params.require(:hashes)&.split(" ")
  end

  def remote_hashes
    @remote_hashes ||= categories_csv.map { |row| row["hash"] }
  end

  def categories_csv
    @categories_csv ||= google_drive.get_or_create_file_as_csv("categories.csv")
  end
end
