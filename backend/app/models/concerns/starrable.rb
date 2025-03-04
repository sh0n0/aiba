module Starrable
  extend ActiveSupport::Concern

  included do
    has_many :stars, as: :starrable
  end

  def starred_count
    stars.count
  end

  # @param [Account] account
  def starred_by?(account)
    stars.exists?(account: account)
  end
end
