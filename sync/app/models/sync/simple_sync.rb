module Sync
  class SimpleSync
    def target_file_name = raise NotImplementedError("Abstract method must be implemented by subclass")
    def columns = raise NotImplementedError("Abstract method must be implemented by subclass")
    def sort_csv_rows_by(row) = raise NotImplementedError("Abstract method must be implemented by subclass")

    def pull_to_local(local_hashes)
      hashes_to_pull = remote_hashes - local_hashes
      csv
        .filter { |row| row["hash"].in?(hashes_to_pull) }
        .map(&:to_h)
    end

    def diff(local_hashes)
      local_hashes - remote_hashes
    end

    def push_to_remote(records)
      records.each do |record|
        if record.values.length == 0 || record.values.any?(&:nil?)
          raise "Invalid category record #{record}"
        end

        csv << CSV::Row.new(columns.map(&:to_s), columns.map { |c| record[c] })
      end

      sorted = CSV::Table.new(csv.sort_by { |row| sort_csv_rows_by(row) })

      google_drive.update_file(target_file_name, sorted)
    end

    private

    def remote_hashes
      @remote_hashes ||= csv.map { |row| row["hash"] }
    end

    def csv
      @csv ||= google_drive.get_or_create_file(target_file_name, as: :csv)
    end

    def google_drive
      @google_drive ||= GoogleDrive.new(access_token: Current.access_token)
    end
  end
end
