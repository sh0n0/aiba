class TweetCreationService
  attr_reader :account, :params, :tweet

  def initialize(account, params)
    @account = account
    @params = params
    @tweet = nil
  end

  def call
    ActiveRecord::Base.transaction do
      @tweet = Tweet.create!(text: params[:text], account: account)
      process_tweet
    end
    @tweet
  end

  private

  def process_tweet
    if params[:companion].present?
      process_companion_tweet
    else
      BroadcastTweetJob.perform_async(@tweet.id)
    end
  end

  def process_companion_tweet
    companion = @account.find_available_companion!(companion_name: params[:companion][:companion_name], creator_name: params[:companion][:creator_name])
    comment = companion.make_comment(tweet)
    BroadcastTweetAndCompanionCommentJob.perform_async(@tweet.id, comment.id)
  end
end
