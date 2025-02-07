class AccountController < ApplicationController
  before_action :set_account

  def show
    render json: @account, serializer: AccountSerializer
  end

  private

  def set_account
    @account = Account.find_by!(name: params.expect(:id))
  end
end
