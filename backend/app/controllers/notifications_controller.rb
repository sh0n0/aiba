class NotificationsController < ApplicationController
  before_action :authenticate_user!

  def index
    notifications = Notification.to_account(current_user.account).recent
    pagy, notifications = pagy(notifications, limit: NOTIFICATIONS_PER_PAGE)
    render json: {
      notifications: ActiveModel::Serializer::CollectionSerializer.new(notifications, serializer: NotificationSerializer),
      page: pagy_metadata(pagy)
    }
  end
end
