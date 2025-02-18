FactoryBot.define do
  factory :user do
    provider { 'email' }
    uid { Faker::Internet.email }
    email { Faker::Internet.email }
    password { 'password' }
    password_confirmation { 'password' }
    confirmed_at { Time.now }
    allow_password_change { false }
    tokens { {} }
    confirmation_token { SecureRandom.hex(10) }
    confirmation_sent_at { Time.now }
    association :account
  end
end
