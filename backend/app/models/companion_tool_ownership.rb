class CompanionToolOwnership < ApplicationRecord
  belongs_to :account
  belongs_to :companion_tool
end
