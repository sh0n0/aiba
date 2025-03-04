FactoryBot.define do
  factory :star do
    association :starrable, factory: :companion
    association :account
  end
end
