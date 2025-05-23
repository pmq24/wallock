class GoogleDrive
  include CsvHeaders

  def initialize(access_token:)
    @drive = Google::Apis::DriveV3::DriveService.new
    @drive.authorization = access_token
  end

  def update_file(name, content)
    file = get_or_create_file(name)
    drive.update_file(file.id, upload_source: StringIO.new(content.to_csv))
  end

  def get_or_create_file_as_csv(name)
    file = get_or_create_file(name)

    file_content = StringIO.new
    drive.get_file(file.id, download_dest: file_content)
    file_content = file_content.string
    CSV.parse(file_content, headers: true)
  end

  def get_or_create_file(name)
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
        end
        csv << headers
      end
      file = drive.create_file({
                                 name: name,
                                 parents: [ root_folder.id ]

                               },
                               upload_source: StringIO.new(csv))
      remove_instance_variable(:@files)
      file
    else
      drive.get_file(ids.first)
    end
  end

  def root_folder
    return @root_folder if defined?(@root_folder)

    files = drive.list_files(q: "'root' in parents and trashed = false").files

    # Our app can only view files it created,
    # which should be the only untrashed folder in the root folder
    @root_folder = files.first
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
end
