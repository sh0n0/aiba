class Star < ApplicationRecord
  belongs_to :starrable, polymorphic: true
  belongs_to :account
end
