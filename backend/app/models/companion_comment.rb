class CompanionComment < ApplicationRecord
  belongs_to :companion
  belongs_to :tweet
end
