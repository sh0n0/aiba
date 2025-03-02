class ApplicationController < ActionController::API
  rescue_from ArgumentError, with: :handle_argument_error

  TWEETS_PER_PAGE = 10
  COMPANIONS_PER_PAGE = 10
  COMPANION_TOOLS_PER_PAGE = 10

  include DeviseTokenAuth::Concerns::SetUserByToken
  include Pagy::Backend

  def not_found
    head :not_found
  end

  def handle_argument_error(exception)
    render json: { error: exception.message }, status: :unprocessable_entity
  end
end
