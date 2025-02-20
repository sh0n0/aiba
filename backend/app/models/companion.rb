class Companion < ApplicationRecord
  belongs_to :creator, class_name: "Account", foreign_key: :created_by

  has_many :companion_ownerships
  has_many :owners, through: :companion_ownerships, source: :account
  has_many :companion_comments
  has_many :companion_tools
  has_many :stars, class_name: "CompanionStar"

  validates :name, presence: true
  validates :description, presence: true
  validates :prompt, presence: true

  scope :published, -> { where.not(published_at: nil) }
  scope :with_name, ->(name) { where(name: name) }
  scope :created_by, ->(account) { where(creator: account) }

  def starred_count
    stars.count
  end

  # @param [Account] account
  def starred_by?(account)
    stars.exists?(account: account)
  end

  # @param [Account] account
  def editable_by?(account)
    creator == account && published_at.nil?
  end

  # @param [Tweet] tweet
  def make_comment(tweet)
    text = Ai::OpenaiApi.instance.generate_sentences(prompt, tweet.text, companion_tools)
    CompanionComment.create(text: text, companion: self, tweet: tweet)
  end

  def publish!
    update!(published_at: Time.now.utc)
  end

  def unpublish!
    update!(published_at: nil)
  end
end
