FactoryBot.define do
  factory :tweet do
    text { Faker::Lorem.paragraph }
    association :account
  end
end
