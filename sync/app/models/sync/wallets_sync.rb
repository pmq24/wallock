module Sync
  class WalletsSync < SimpleSync
    def target_file_name = "wallets.csv"
    def columns = [ :id, :name, :currency_code, :is_default, :hash ]
    def sort_csv_rows_by(row) = [ row["is_default"], row["name"] ]
  end
end
