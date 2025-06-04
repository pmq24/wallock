class GoogleDrive
  include CsvHeaders

  def initialize(access_token:)
    @drive = Google::Apis::DriveV3::DriveService.new
    @drive.authorization = access_token
  end

  def update_file(name, content)
    id = get_or_create_file(name, as: :id)
    drive.update_file(id, upload_source: StringIO.new(content.to_csv))
  end

  def create_file(name)
    drive.create_file({ name:, parents: [ root_folder_id ] })
  end

  def get_file(name)
    file_id = get_file_id(name)

    return nil if file_id.nil?

    file = new GoogleDrive::File.new

    file_content = StringIO.new
    drive.get_file(id, download_dest: file_content)

    file.id = file_id
    file.name = raw_file.name
    file.content = file_content.string
    file
  end

  def get_file_id(name)
    Rails.cache.fetch("file_id:#{name}", skip_nil: true, expires_in: 1.day) do
      q = "trashed = false and '#{root_folder_id}' in parents and name contains '#{name}'"
      fields = "files(id,name)"
      files = drive.list_files(q:, fields:).files

      raise "Multiple files with name #{name} found" if files.length > 1
      return nil if files.length == 0

      files.first.id
    end
  end

  def get_or_create_file_as_csv(name)
    ActiveSupport::Deprecation.new.warn

    file = get_or_create_file(name)

    file_content = StringIO.new
    drive.get_file(file.id, download_dest: file_content)
    file_content = file_content.string
    CSV.parse(file_content, headers: true)
  end

  def get_or_create_file(name, as: :csv)
    ActiveSupport::Deprecation.new.warn

    ids = files.filter_map { |file| file.name == name ? file.id : nil }

    if ids.length > 1
      raise "Multiple files with name #{name} found"
    end

    if ids.blank?
      csv = CSV.generate do |csv|
        headers = case name
        when "hash.csv"
                    HASH_CSV_HEADERS
        when "categories.csv"
                    CATEGORIES_CSV_HEADERS
        when "wallets.csv"
                    WALLETS_CSV_HEADERS
        when "transactions.csv"
                    TRANSACTIONS_CSV_HEADERS
        end
        csv << headers
      end
      file = drive.create_file({
                                 name: name,
                                 parents: [ root_folder.id ]

                               },
                               upload_source: StringIO.new(csv))
      remove_instance_variable(:@files)
    else
      file_id = ids.first
    end

    case as
    when :csv
      get_file_content_from_id(file&.id || file_id)
    when :id
      file&.id || file_id
    end
  end

  def root_folder
    ActiveSupport::Deprecation.new.warn

    return @root_folder if defined?(@root_folder)

    files = drive.list_files(q: "'root' in parents and trashed = false").files

    # Our app can only view files it created,
    # which should be the only untrashed folder in the root folder
    @root_folder = files.first
  end


  def root_folder_id
    Rails.cache.fetch("root_folder_id", expires_in: 1.day) do
      files = drive.list_files(q: "'root' in parents and trashed = false").files

      raise "Multiple root folders found" if files.length > 1
      return files.first.id if files.length == 1

      root_folder = google_drive.create_file({ name: "Wallock", mime_type: "application/vnd.google-apps.folder" })
      root_folder.id
    end
  end

  private

  attr_reader :drive

  def files
    return @files if defined?(@files)

    query = drive.list_files(
      q: "trashed = false and '#{root_folder.id}' in parents",
      fields: "files(id, name)"
    )
    @files = query.files
  end

  def get_file_content_from_id(id)
    file_content = StringIO.new
    drive.get_file(id, download_dest: file_content)
    file_content = file_content.string
    CSV.parse(file_content, headers: true)
  end
end
