class RootFolderController < ApplicationController
  def show
    render(json: google_drive.root_folder, status: :ok)
  end
end
