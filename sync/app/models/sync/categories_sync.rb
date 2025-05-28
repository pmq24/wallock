module Sync
  class CategoriesSync < SimpleSync
    def target_file_name = "categories.csv"
    def columns = [ :id, :type, :name, :hash ]
    def sort_csv_rows_by(row) = [ row["type"], row["name"] ]
  end
end
