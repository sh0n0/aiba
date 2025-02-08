class CompanionSerializer < ActiveModel::Serializer
  attributes :name, :description, :published_at

  has_one :creator, serializer: AccountSerializer

  def account
    instance_options[:account]
  end
end
