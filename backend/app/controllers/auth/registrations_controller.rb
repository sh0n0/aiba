class Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  def render_create_success
    signed_name = AnyCable::Streams.signed("timeline/public")
    render json: @resource.as_json.merge(feed_stream_name: signed_name)
  end

  private

  def sign_up_params
    params.require(:user).permit(:email, :password, account_attributes: [ :name ])
  end
end
