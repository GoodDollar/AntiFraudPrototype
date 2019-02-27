Rails.application.routes.draw do
  namespace :admin do
      resources :users

      root to: "users#index"
    end
  resources :users, only: [:create] do
    collection do
      post 'login'
    end
  end
end
