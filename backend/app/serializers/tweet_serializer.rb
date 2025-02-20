class TweetSerializer < ActiveModel::Serializer
  attributes :id, :text

  has_one :companion_comment, serializer: CompanionCommentSerializer
  has_one :account, serializer: AccountSerializer
end
