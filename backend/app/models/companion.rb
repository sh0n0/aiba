class Companion < ApplicationRecord
  belongs_to :creator, class_name: "Account", foreign_key: "created_by"

  validates :name, presence: true
  validates :description, presence: true
  validates :prompt, presence: true
end
