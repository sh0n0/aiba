class StreamsController < ApplicationController
  before_action :authenticate_user!

  def my
    public_stream = AnyCable::Streams.signed("timeline/public")
    notification_stream = AnyCable::Streams.signed("notifications:#{current_user.account.id}")

    render json: {
      timeline: {
        public: public_stream
      },
      notifications: notification_stream
    }
  end
end
