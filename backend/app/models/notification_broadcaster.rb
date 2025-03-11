class NotificationBroadcaster
  def initialize(notification)
    @notification = notification
  end

  def broadcast
    message = ActiveModelSerializers::SerializableResource.new(@notification).serializable_hash
    ActionCable.server.broadcast("notifications:#{@notification.to_account_id}", message)
  end
end
