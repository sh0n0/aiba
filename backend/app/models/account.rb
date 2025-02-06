class Account < ApplicationRecord
  has_one :user, inverse_of: :account
  has_many :tweets
  has_many :created_companions, class_name: "Companion", foreign_key: :created_by

  has_many :companion_ownerships
  has_many :owned_companions, through: :companion_ownerships, source: :companion

  validates :name, presence: true, uniqueness: true

  before_create :generate_keys

  def display_name
    super || name
  end

  # @return [Companion, nil]
  def default_companion
    owned_companions.find_by(companion_ownerships: { is_default: true })
  end

  private

  def generate_keys
    keypair = OpenSSL::PKey::RSA.new(2048)
    self.private_key = keypair.to_pem
    self.public_key = keypair.public_key.to_pem
  end
end
