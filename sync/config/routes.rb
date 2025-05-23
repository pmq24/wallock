Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  resource :auth, controller: :auth do
    member do
      get :callback
    end
  end

  resource :root_folder, controller: :root_folder

  resource :categories_sync, controller: :categories_sync do
    member do
      get :hash

      get :pull_to_local

      get :different_from_remote
      post :push_to_remote
    end
  end
end
