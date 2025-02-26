class TimelineBroadcaster
  # @param [Tweet] tweet
  # @param [CompanionComment] companion_comment
  def self.broadcast_tweet_and_comment_to_public(tweet, companion_comment)
    account = tweet.account
    companion = companion_comment.companion

    ActionCable.server.broadcast("timeline/public", {
      id: tweet.id,
      text: tweet.text,
      companionComment: {
        id: companion_comment.id,
        text: companion_comment.text,
        companion: {
          name: companion.name,
          creator: {
            name: companion.creator.name
          }
        }
      },
      account: {
        name: account.name,
        displayName: account.display_name,
        avatarUrl: account.avatar_url
      },
      reactions: []
    })
  end

  # @param [Tweet] tweet
  def self.broadcast_tweet_to_public(tweet)
    account = tweet.account

    ActionCable.server.broadcast("timeline/public", {
      id: tweet.id,
      text: tweet.text,
      companionComment: nil,
      account: {
        name: account.name,
        displayName: account.display_name,
        avatarUrl: account.avatar_url
      },
      reactions: []
    })
  end
end
