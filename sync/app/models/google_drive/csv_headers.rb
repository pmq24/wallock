class GoogleDrive
  module CsvHeaders
    HASH_CSV_HEADERS = [ "name", "hash" ].freeze
    CATEGORIES_CSV_HEADERS = [ "id", "type", "name", "hash" ].freeze
    WALLETS_CSV_HEADERS = [ "id", "name", "currency_code", "hash" ].freeze
    TRANSACTIONS_CSV_HEADERS = [ "id", "time", "amount", "category_id", "wallet_id", "hash" ].freeze
  end
end
