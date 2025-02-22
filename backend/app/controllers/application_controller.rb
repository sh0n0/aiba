class ApplicationController < ActionController::API
  TWEETS_PER_PAGE = 10
  COMPANIONS_PER_PAGE = 10

  include DeviseTokenAuth::Concerns::SetUserByToken
  include Pagy::Backend

  def not_found
    head :not_found
  end
end
