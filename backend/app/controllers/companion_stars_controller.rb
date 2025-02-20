class CompanionStarsController < ApplicationController
  before_action :authenticate_user!

  def create
    companion = find_companion
    return render status: :not_found if companion.nil?

    current_user.account.starred_companions << companion

    render json: {}, status: :created
  end

  def destroy
    companion = find_companion
    return render status: :not_found if companion.nil?

    current_user.account.starred_companions.delete(companion)

    render json: {}, status: :no_content
  end

  private

  def find_companion
    account = Account.find_by!(name: params[:account_name])
    companion = Companion.created_by(account).with_name(params[:companion_name]).first
  end
end
