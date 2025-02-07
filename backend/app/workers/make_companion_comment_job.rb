class MakeCompanionCommentJob
  include Sidekiq::Job

  # @param [Integer] companion_id
  # @param [Integer] tweet_id
  def perform(companion_id, tweet_id)
    companion = Companion.find(companion_id)
    tweet = Tweet.find(tweet_id)

    comment = companion.make_comment(tweet)
    BroadcastTweetAndCompanionCommentJob.perform_async(tweet_id, comment.id)
  end
end
