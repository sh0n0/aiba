class TweetsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_tweet, only: %i[ show destroy ]

  def index
    @tweets = Tweet.all

    render json: @tweets
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
