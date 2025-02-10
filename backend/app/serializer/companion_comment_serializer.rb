class CompanionCommentSerializer < ActiveModel::Serializer
  attributes :id, :text

  belongs_to :companion, serializer: CompanionSerializer
end
