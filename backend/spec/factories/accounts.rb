FactoryBot.define do
  factory :account do
    name { Faker::Name.name }
    private_key { Faker::Crypto.md5 }
    public_key { Faker::Crypto.md5 }
    display_name { Faker::Name.name }
  end
end
