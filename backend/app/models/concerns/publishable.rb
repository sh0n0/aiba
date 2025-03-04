module Publishable
  extend ActiveSupport::Concern

  included do
    scope :published, -> { where.not(published_at: nil) }
  end

  def publish!
    update!(published_at: Time.now.utc)
  end

  def unpublish!
    update!(published_at: nil)
  end
end
