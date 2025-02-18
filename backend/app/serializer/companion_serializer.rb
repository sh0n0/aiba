class CompanionSerializer < ActiveModel::Serializer
  attributes :name, :description, :published_at

  has_one :creator, serializer: AccountSerializer
end
