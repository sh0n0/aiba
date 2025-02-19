FactoryBot.define do
  factory :account do
    name { Faker::Name.first_name }
    private_key { Faker::Crypto.md5 }
    public_key { Faker::Crypto.md5 }
    display_name { Faker::Name.name }
    avatar { Rack::Test::UploadedFile.new(Rails.root.join('spec', 'fixtures', 'files', 'avatar.png')) }
  end
end
