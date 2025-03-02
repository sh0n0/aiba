class CompanionToolDetailSerializer < ActiveModel::Serializer
  attributes :name, :description, :url, :published_at

  has_one :creator, serializer: AccountSerializer

  def url
    object.creator == account ? object.url : nil
  end

  def account
    instance_options[:account]
  end
end
