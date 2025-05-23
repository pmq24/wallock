module UpdateHashCsv
  extend ActiveSupport::Concern

  included do
    def update_hash_csv
      categories_csv = google_drive.get_or_create_file_as_csv("categories.csv")
      joined_hashes = categories_csv.map { |row| row["hash"] }.sort.join(" ")
      categories_hash = Digest::SHA1.hexdigest(joined_hashes)

      csv = CSV::Table.new([])
      csv << CSV::Row.new(GoogleDrive::HASH_CSV_HEADERS, [ "categories", categories_hash ])

      google_drive.update_file("hash.csv", csv)
    end
  end
end
