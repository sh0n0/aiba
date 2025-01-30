class Companion < ApplicationRecord
  belongs_to :account

  validates :name, presence: true
  validates :description, presence: true
  validates :prompt, presence: true
end
