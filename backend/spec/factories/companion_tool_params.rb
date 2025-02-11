FactoryBot.define do
  factory :companion_tool_param do
    name { Faker::Types.rb_string }
    description { Faker::Lorem.sentence }
    param_type { :string }
    association :companion_tool
  end
end
