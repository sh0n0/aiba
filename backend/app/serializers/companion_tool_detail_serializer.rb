class CompanionToolDetailSerializer < ActiveModel::Serializer
  attributes :name, :description, :url, :published_at, :starred, :starred_count

  has_one :creator, serializer: AccountSerializer

  def starred
    object.starred_by?(account)
  end

  def url
    object.creator == account ? object.url : nil
  end

  def account
    instance_options[:account]
  end
end
