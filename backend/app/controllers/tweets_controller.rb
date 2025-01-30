class TweetsController < ApplicationController
  before_action :set_tweet, only: %i[ show destroy ]

  def index
    @tweets = Tweet.all

    render json: @tweets
  end

  def show
    render json: @tweet
  end

  def create
    @tweet = Tweet.new(tweet_params)

    if @tweet.save
      render json: @tweet, status: :created, location: @tweet
    else
      render json: @tweet.errors, status: :unprocessable_entity
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
      params.expect(tweet: [ :text, :account_id ])
    end
end
