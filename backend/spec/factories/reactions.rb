FactoryBot.define do
  factory :reaction do
    emoji { %w[😀 😂 😍 🤔 😭 🙌 🔥 🎉 💡 🚀].sample }
    association :account
    association :reactable, factory: :tweet
  end
end
