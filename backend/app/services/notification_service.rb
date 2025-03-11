class NotificationService
  def call(notifiable, to_account, from_account)
    return if to_account == from_account

    @notification = Notification.create!(notifiable: notifiable, to_account: to_account, from_account: from_account)

    notify
  end

  private

  def notify
    BroadcastNotificationJob.perform_async(@notification.id)
  end
end
