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
    account = current_user.account
    tweet = Tweet.new(tweet_params.merge(account: account))

    if tweet.save
      companion = account.default_companion
      MakeCompanionCommentJob.perform_async(companion.id, tweet.id) if companion.present?

      render json: tweet, status: :created, location: tweet
    else
      render json: tweet.errors, status: :unprocessable_entity
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
    params.expect(tweet: [ :text ])
  end
end
