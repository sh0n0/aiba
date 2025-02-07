class TimelineBroadcaster
  # @param [Tweet] tweet
  def self.broadcast_tweet_to_public(tweet)
    account = tweet.account

    ActionCable.server.broadcast("timeline/public", {
      id: tweet.id,
      text: tweet.text,
      accountId: account.name,
      accountName: account.display_name
    })
  end

  # @param [CompanionComment] companion_comment
  def self.broadcast_comment_to_public(companion_comment)
    companion = companion_comment.companion

    ActionCable.server.broadcast("timeline/public", {
      companionCommentId: companion_comment.id,
      text: companion_comment.text,
      companionId: companion.id,
      companionName: companion.name,
      tweetId: companion_comment.tweet_id
    })
  end
end
