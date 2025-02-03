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
    account = Account.find(tweet_params[:account_id])

    # FIXME
    SampleJob.perform_async("Hello, world!")
    ActionCable.server.broadcast("timeline/public", { id: @tweet.id, text: @tweet.text, accountId: account.name, accountName: account.display_name })

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
