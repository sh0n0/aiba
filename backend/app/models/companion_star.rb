class CompanionStar < ApplicationRecord
  belongs_to :companion
  belongs_to :account

  validates :companion_id, uniqueness: { scope: :account_id }
end
