FactoryBot.define do
  factory :companion_ownership do
    association :account
    association :companion
    is_default { false }
  end
end
