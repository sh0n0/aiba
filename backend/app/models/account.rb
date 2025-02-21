class Account < ApplicationRecord
  has_one :user, inverse_of: :account
  has_many :tweets
  has_many :created_companions, class_name: "Companion", foreign_key: :created_by

  has_many :companion_ownerships
  has_many :owned_companions, through: :companion_ownerships, source: :companion

  has_many :companion_stars
  has_many :starred_companions, through: :companion_stars, source: :companion

  has_one_attached :avatar

  validates :name, presence: true, uniqueness: true

  before_create :generate_keys

  def display_name
    super || name
  end

  def avatar_url
    Rails.application.routes.url_helpers.url_for(avatar) if avatar.attached?
  end

  def default_companion
    owned_companions.find_by(companion_ownerships: { is_default: true })
  end

  def companions_count
    created_companions.published.count
  end

  private

  def generate_keys
    keypair = OpenSSL::PKey::RSA.new(2048)
    self.private_key = keypair.to_pem
    self.public_key = keypair.public_key.to_pem
  end
end
