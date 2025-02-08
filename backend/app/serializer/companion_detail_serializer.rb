class CompanionDetailSerializer < ActiveModel::Serializer
  attributes :name, :description, :prompt, :published_at

  has_one :creator, serializer: AccountSerializer

  def prompt
    object.creator == account ? object.prompt : nil
  end

  def account
    instance_options[:account]
  end
end
