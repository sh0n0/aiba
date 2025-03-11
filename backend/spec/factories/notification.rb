FactoryBot.define do
  factory :notification do
    read_at { nil }
    association :notifiable, factory: :reaction
    association :to_account, factory: :account
    association :from_account, factory: :account
  end
end
