class Reaction < ApplicationRecord
  belongs_to :account
  belongs_to :reactable, polymorphic: true

  validates :emoji, presence: true
  validates :account_id, uniqueness: { scope: [ :reactable_type, :reactable_id, :emoji ] }
  validate :emoji_must_be_single

  scope :grouped_by_emoji, ->(account) {
    includes(:account)
      .group_by(&:emoji)
      .map do |emoji, grouped|
      {
        emoji: emoji,
        count: grouped.count,
        has_reacted: grouped.any? { |reaction| reaction.account_id == account&.id },
        accounts: grouped.reject { |reaction| reaction.account.name == account&.name }.map do |reaction|
          {
            name: reaction.account.name,
            display_name: reaction.account.display_name
          }
        end
      }
    end
  }

  def emoji_must_be_single
    scan = emoji.scan(Unicode::Emoji::REGEX)
    unless scan.size == 1 && scan.first == emoji
      errors.add(:emoji, "must be a single emoji")
    end
  end
end
