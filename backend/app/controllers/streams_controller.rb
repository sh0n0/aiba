class StreamsController < ApplicationController
  before_action :authenticate_user!

  def my
    public_stream = AnyCable::Streams.signed("timeline/public")
    render json: { publicStream: public_stream }
  end
end
