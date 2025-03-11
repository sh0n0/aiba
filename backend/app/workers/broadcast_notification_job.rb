class BroadcastNotificationJob
  include Sidekiq::Job

  def perform(notification_id)
    notification = Notification.includes(:to_account).find(notification_id)
    NotificationBroadcaster.new(notification).broadcast
  end
end
