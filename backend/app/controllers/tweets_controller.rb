class TweetsController < ApplicationController
  before_action :authenticate_user!, only: %i[ create destroy ]
  before_action :set_tweet, only: %i[ show destroy ]

  def index
    tweets = Tweet.recent.eager_load(:account, companion_comment: { companion: :creator }, reactions: :account)
    _, tweets = pagy(tweets, limit: TWEETS_PER_PAGE)
    render json: tweets, each_serializer: TweetSerializer, current_account: current_user&.account
  end

  def show
    render json: @tweet
  end

  def create
    begin
      tweet = TweetCreationService.new(current_user.account, tweet_params).call
      render json: tweet, status: :created, serializer: TweetSerializer
    rescue ActiveRecord::RecordNotFound => e
      render json: { error: e.message }, status: :not_found and return
    rescue StandardError => e
      render json: { error: e.message }, status: :unprocessable_entity and return
    end
  end

  def destroy
    @tweet.destroy!
  end

  private

  def set_tweet
    @tweet = Tweet.find(params.expect(:id))
  end

  def tweet_params
    if params[:companion].nil?
      params.require(:tweet).permit(:text)
    else
      companion_params = params.require(:companion).permit(:creator_name, :companion_name)
      tweet_params = params.require(:tweet).permit(:text)

      {
        text: tweet_params[:text],
        companion: companion_params
      }
    end
  end
end
