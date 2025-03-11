class ReactionSerializer < ActiveModel::Serializer
  attributes :emoji

  has_one :reactable, polymorphic: true
end
