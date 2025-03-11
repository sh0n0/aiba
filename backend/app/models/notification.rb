class Notification < ApplicationRecord
  belongs_to :notifiable, polymorphic: true
  belongs_to :to_account, class_name: "Account"
  belongs_to :from_account, class_name: "Account"

  scope :recent, -> { order(id: :desc) }
  scope :to_account, ->(account) { where(to_account: account) }
end
