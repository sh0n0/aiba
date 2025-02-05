class CompanionOwnership < ApplicationRecord
  belongs_to :account
  belongs_to :companion

  validates :account_id, uniqueness: { scope: :companion_id }
  validates :is_default, inclusion: { in: [ true, false ] }
  validate :unique_default_for_account, if: :is_default?

  private

  def unique_default_for_account
    if CompanionOwnership.where(account_id: account_id, is_default: true).exists?
      errors.add(:is_default, "can only be true for one companion per account")
    end
  end
end
