class ApplicationController < ActionController::API
  before_action :authenticate_google_api

  private

  def google_drive
    return @google_drive if defined?(@google_drive)

    access_token = request.headers["Authorization"].delete_prefix("Bearer ")
    @google_drive = GoogleDrive.new(access_token:)
  end

  def authenticate_google_api
    if request.headers["Authorization"].blank?
      render(status: :unauthorized)
    end
  end
end
