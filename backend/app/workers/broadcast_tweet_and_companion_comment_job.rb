class BroadcastTweetAndCompanionCommentJob
  include Sidekiq::Job

  # @param [Integer] tweet_id
  # @param [Integer] companion_comment_id
  def perform(tweet_id, companion_comment_id)
    tweet = Tweet.find(tweet_id)
    companion_comment = CompanionComment.find(companion_comment_id)

    TimelineBroadcaster.broadcast_tweet_and_comment_to_public(tweet, companion_comment)
  end
end
