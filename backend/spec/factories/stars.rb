FactoryBot.define do
  factory :star do
    association :starrable
    association :account
  end
end
