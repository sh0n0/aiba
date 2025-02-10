class AccountController < ApplicationController
  TWEETS_PER_PAGE = 10

  before_action :set_account

  rescue_from Pagy::OverflowError, with: :not_found

  def show
    render json: @account, serializer: AccountSerializer
  end

  def tweets
    tweets = @account.tweets.recent.eager_load(:account, companion_comment: { companion: :creator })
    _, tweets = pagy(tweets, limit: TWEETS_PER_PAGE)
    render json: tweets, each_serializer: TweetSerializer
  end

  private

  def set_account
    @account = Account.find_by!(name: params.expect(:name))
  end
end
