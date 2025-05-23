class AuthController < ApplicationController
  skip_before_action :authenticate_google_api

  def show
    redirect_uri = params.require(:redirect_uri)
    state = SecureRandom.alphanumeric
    redirect_to(oauth2_client.authorization_uri(redirect_uri:, state:), allow_other_host: true)
  end

  def callback
    code, state, redirect_uri = params.require([ :code, :state, :redirect_uri ])
    oauth2_client.code = code
    oauth2_client.state = state
    oauth2_client.redirect_uri = redirect_uri

    access_token_data = oauth2_client.fetch_access_token!

    create_root_folder(access_token_data["access_token"])

    render(json: access_token_data, status: :ok)
  end

  private

  def create_root_folder(access_token)
    google_drive = Google::Apis::DriveV3::DriveService.new
    google_drive.authorization = access_token

    files = google_drive.list_files(q: "trashed = false").files

    if files.length == 0
      google_drive.create_file({ name: "Wallock", mime_type: "application/vnd.google-apps.folder" })
    end
  end

  def oauth2_client
    @oauth2_client ||= Signet::OAuth2::Client.new(
      authorization_uri: "https://accounts.google.com/o/oauth2/auth",
      token_credential_uri: "https://oauth2.googleapis.com/token",
      client_id: ENV["GOOGLE_CLIENT_ID"],
      client_secret: ENV["GOOGLE_CLIENT_SECRET"],
      scope: "https://www.googleapis.com/auth/drive.file",
    )
  end
end
