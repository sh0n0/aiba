FactoryBot.define do
  factory :companion_tool do
    name { Faker::Name.first_name }
    description { Faker::Lorem.sentence }
    url { Faker::Internet.url }
    published_at { Faker::Time.backward }

    association :creator, factory: :account
  end
end
