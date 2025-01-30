Rails.application.routes.draw do
  resources :companions
  resources :tweets
  mount LetterOpenerWeb::Engine, at: "letter_opener" if Rails.env.development?

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
