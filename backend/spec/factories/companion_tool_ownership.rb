FactoryBot.define do
  factory :companion_tool_ownership do
    association :account
    association :companion_tool
  end
end
