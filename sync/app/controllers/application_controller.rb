class ApplicationController < ActionController::API
  before_action :authenticate_google_api

  rescue_from Google::Apis::AuthorizationError do
    render(status: :unauthorized)
  end

  private

  def google_drive
    return @google_drive if defined?(@google_drive)

    access_token = request.headers["Authorization"].delete_prefix("Bearer ")
    @google_drive = GoogleDrive.new(access_token:)
  end

  def authenticate_google_api
    access_token = request.headers["Authorization"]&.delete_prefix("Bearer ")
    if access_token.blank?
      render(status: :unauthorized)
    end

    Current.access_token = access_token
  end
end
