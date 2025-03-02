class AccountSerializer < ActiveModel::Serializer
  attributes :name, :display_name, :created_at, :avatar_url, :companions_count, :companion_tools_count

  def companions_count
    object.companions_count(account)
  end

  def companion_tools_count
    object.companion_tools_count(account)
  end

  def account
    instance_options[:account]
  end
end
