FactoryBot.define do
  factory :companion_comment do
    text { Faker::Lorem.sentence }
    association :companion
    association :tweet
  end
end
