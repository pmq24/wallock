module Sync
  class TransactionsSync < SimpleSync
    def target_file_name = "transactions.csv"
    def columns = [ :id, :time, :amount, :category_id, :wallet_id, :hash ]
    def sort_csv_rows_by(row) = [ row["time"], row["wallet_id"], row["amount"], row["id"] ]
  end
end
