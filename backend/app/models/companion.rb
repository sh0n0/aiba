class Companion < ApplicationRecord
  belongs_to :creator, class_name: "Account", foreign_key: :created_by

  has_many :companion_ownerships
  has_many :owners, through: :companion_ownerships, source: :account

  validates :name, presence: true
  validates :description, presence: true
  validates :prompt, presence: true

  scope :published, -> { where.not(published_at: nil) }
  scope :with_name, ->(name) { where(name: name) }
  scope :created_by, ->(account) { where(creator: account) }

  # @param [Account] account
  def editable_by?(account)
    creator == account && published_at.nil?
  end

  # @param [Tweet] tweet
  def make_comment(tweet)
    text = Ai::OpenaiApi.instance.make_sentences(prompt, tweet.text)
    CompanionComment.create(text: text, companion: self, tweet: tweet)
  end
end
