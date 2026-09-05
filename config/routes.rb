Rails.application.routes.draw do
  root 'home#index'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get 'up' => 'rails/health#show', as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  # The formats are pinned because only service-worker.js / manifest.json.erb
  # exist; without this a request preferring text/html raises MissingTemplate.
  get 'service-worker' => 'rails/pwa#service_worker', as: :pwa_service_worker, defaults: { format: :js }
  get 'manifest' => 'rails/pwa#manifest', as: :pwa_manifest, defaults: { format: :json }

  # Defines the root path route ("/")
  # root "posts#index"

  post 'process_benchmark', to: 'process#benchmark'
  get '*path', to: 'home#index', constraints: ->(req) { !req.xhr? && req.format.html? }
end
