FactoryBot.define do
  factory :companion_tool do
    name { Faker::Name.name }
    description { Faker::Lorem.sentence }
    url { Faker::Internet.url }
    association :companion
  end
end
