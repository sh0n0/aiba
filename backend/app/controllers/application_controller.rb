class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
  include Pagy::Backend

  def not_found
    head :not_found
  end
end
