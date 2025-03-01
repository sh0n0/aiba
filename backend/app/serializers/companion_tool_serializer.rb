class CompanionToolSerializer < ActiveModel::Serializer
  attributes :id, :name, :description

  has_one :creator, serializer: AccountSerializer
end
