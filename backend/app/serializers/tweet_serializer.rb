class TweetSerializer < ActiveModel::Serializer
  attributes :id, :text, :reactions

  has_one :companion_comment, serializer: CompanionCommentSerializer
  has_one :account, serializer: AccountSerializer

  def reactions
    object.reactions.grouped_by_emoji(current_account)
  end

  def current_account
    instance_options[:current_account]
  end
end
