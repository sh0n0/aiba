class NotificationSerializer < ActiveModel::Serializer
  attributes :id, :read_at, :created_at

  attribute :notifiable do
    case object.notifiable_type
    when "Reaction"
      {
        reaction: {
          tweet: {
            id: object.notifiable.reactable.id,
            text: object.notifiable.reactable.text
          },
          emoji: object.notifiable.emoji
        }
      }
    else
      raise NotImplementedError
    end
  end

  attribute :from do
    {
      name: object.from_account.name,
      displayName: object.from_account.display_name
    }
  end
end
