module Sync
  class WalletsSync < SimpleSync
    def target_file_name = "wallets.csv"
    def columns = [ :id, :name, :currency_code, :is_default, :hash ]
    def sort_csv_rows_by(row)
      [
        ActiveModel::Type::Boolean.new.cast(row["is_default"]) ? 0 : 1,
        row["name"]
      ]
    end
  end
end
