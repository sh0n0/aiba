class Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  private

  def sign_up_params
    params.require(:user).permit(:email, :password, account_attributes: [ :name ])
  end
end
