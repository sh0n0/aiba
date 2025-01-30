class Tweet < ApplicationRecord
  belongs_to :account

  validates :text, presence: true
end
