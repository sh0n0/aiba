class Account < ApplicationRecord
  has_one :user, inverse_of: :account
  has_many :tweets

  validates :name, presence: true, uniqueness: true

  before_create :generate_keys

  private

  def generate_keys
    keypair = OpenSSL::PKey::RSA.new(2048)
    self.private_key = keypair.to_pem
    self.public_key  = keypair.public_key.to_pem
  end
end
