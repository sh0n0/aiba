class Companion < ApplicationRecord
  include Publishable
  include Starrable

  belongs_to :creator, class_name: "Account", foreign_key: :created_by

  has_many :companion_companion_tools
  has_many :companion_tools, through: :companion_companion_tools

  has_many :companion_ownerships
  has_many :owners, through: :companion_ownerships, source: :account
  has_many :companion_comments

  validates :name, presence: true
  validates :description, presence: true
  validates :prompt, presence: true

  scope :with_name, ->(name) { where(name: name) }
  scope :created_by, ->(account) { where(creator: account) }
  scope :recent, -> { order(id: :desc) }

  # @param [Account] account
  def editable_by?(account)
    creator == account && published_at.nil?
  end

  # @param [Tweet] tweet
  def make_comment(tweet)
    text = Ai::OpenaiApi.instance.generate_sentences(prompt, tweet.text, companion_tools)
    CompanionComment.create(text: text, companion: self, tweet: tweet)
  end
end
