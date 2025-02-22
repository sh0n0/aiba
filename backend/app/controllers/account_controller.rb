class AccountController < ApplicationController
  before_action :set_account, only: %i[show tweets companions]

  rescue_from Pagy::OverflowError, with: :not_found

  def show
    render json: @account, serializer: AccountSerializer
  end

  def my
    render json: current_user.account, serializer: AccountSerializer
  end

  def avatar
    account = current_user.account
    account.avatar.attach(params.require(:avatar))
    account.save!
    render json: account, serializer: AccountSerializer
  end

  def tweets
    tweets = @account.tweets.recent.eager_load(:account, companion_comment: { companion: :creator })
    _, tweets = pagy(tweets, limit: TWEETS_PER_PAGE)
    render json: tweets, each_serializer: TweetSerializer
  end

  def companions
    companions = @account.created_companions.recent.published
    pagy, companions = pagy(companions, limit: COMPANIONS_PER_PAGE)
    render json: { companions: companions, page: pagy_metadata(pagy) }, each_serializer: CompanionSerializer
  end

  private

  def set_account
    @account = Account.find_by!(name: params.expect(:name))
  end
end
