class BroadcastTweetJob
  include Sidekiq::Job

  # @param [Integer] tweet_id
  def perform(tweet_id)
    tweet = Tweet.find(tweet_id)
    TimelineBroadcaster.broadcast_tweet_to_public(tweet)
  end
end
