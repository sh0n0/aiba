FactoryBot.define do
  factory :companion do
    name { Faker::Name.name }
    description { Faker::Lorem.paragraph }
    prompt { Faker::Lorem.sentence }
    published_at { Faker::Time.backward }

    association :creator, factory: :account
  end
end
