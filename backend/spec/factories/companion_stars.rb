FactoryBot.define do
  factory :companion_star do
    association :companion
    association :account
  end
end
