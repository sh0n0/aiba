class StarsController < ApplicationController
  before_action :authenticate_user!

  def create
    starrable = find_starrable
    return render status: :not_found if starrable.nil?

    current_user.account.stars.find_or_create_by(starrable: starrable)

    render json: {}, status: :created
  end

  def destroy
    starrable = find_starrable
    return render status: :not_found if starrable.nil?

    current_user.account.stars.where(starrable: starrable).destroy_all

    render json: {}, status: :no_content
  end

  private

  def find_starrable
    account = Account.find_by!(name: params[:account_name])

    if params[:companion_name]
      Companion.created_by(account).with_name(params[:companion_name]).first
    elsif params[:tool_name]
      CompanionTool.created_by(account).with_name(params[:tool_name]).first
    end
  end
end
