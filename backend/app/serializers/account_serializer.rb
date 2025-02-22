class AccountSerializer < ActiveModel::Serializer
  attributes :name, :display_name, :created_at, :avatar_url, :companions_count
end
