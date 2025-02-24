class Tweet < ApplicationRecord
  belongs_to :account
  has_one :companion_comment
  has_many :reactions, as: :reactable

  validates :text, presence: true

  scope :recent, -> { order(id: :desc) }
end
