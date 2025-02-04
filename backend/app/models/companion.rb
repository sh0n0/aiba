class Companion < ApplicationRecord
  belongs_to :creator, class_name: "Account", foreign_key: "created_by"

  validates :name, presence: true
  validates :description, presence: true
  validates :prompt, presence: true

  # @param [Account] account
  def editable_by?(account)
    creator == account && published_at.nil?
  end
end
