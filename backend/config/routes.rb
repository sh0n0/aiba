require "sidekiq/web"

Rails.application.routes.draw do
  post "companions/:account_name/:companion_name/star", to: "companion_stars#create"
  delete "companions/:account_name/:companion_name/star", to: "companion_stars#destroy"

  resources :companions, only: [ :index, :create, :update, :destroy ] do
    get :owned, on: :collection
  end
  get "companions/:account_name/:companion_name", to: "companions#show"
  post "companions/:account_name/:companion_name/publish", to: "companions#publish"
  post "companions/:account_name/:companion_name/unpublish", to: "companions#unpublish"

  resources :tweets

  get "account/my", to: "account#my"
  post "account/avatar", to: "account#avatar"
  get "account/:name/tweets", to: "account#tweets"
  get "account/:name/companions", to: "account#companions"

  resources :account, param: :name, only: [ :show ]

  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?
  mount Sidekiq::Web => "/sidekiq" # FIXME: add authentication

  mount_devise_token_auth_for "User", at: "auth", controllers: {
    registrations: "auth/registrations"
  }
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
