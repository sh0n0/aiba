class CompanionDetailSerializer < ActiveModel::Serializer
  attributes :name, :description, :prompt, :published_at, :starred, :starred_count

  has_one :creator, serializer: AccountSerializer

  def starred
    object.starred_by?(account)
  end

  def prompt
    object.creator == account ? object.prompt : nil
  end

  def account
    instance_options[:account]
  end
end
