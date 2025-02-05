class Companion < ApplicationRecord
  belongs_to :creator, class_name: "Account", foreign_key: "created_by"

  has_many :companion_ownerships
  has_many :owners, through: :companion_ownerships, source: :account

  validates :name, presence: true
  validates :description, presence: true
  validates :prompt, presence: true

  # @param [Account] account
  def editable_by?(account)
    creator == account && published_at.nil?
  end
end
