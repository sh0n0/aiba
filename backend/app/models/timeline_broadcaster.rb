class TimelineBroadcaster
  # @param [Tweet] tweet
  # @param [CompanionComment] companion_comment
  def self.broadcast_to_public(tweet, companion_comment)
    account = tweet.account
    companion = companion_comment.companion

    ActionCable.server.broadcast("timeline/public", {
      tweet: {
        id: tweet.id,
        text: tweet.text,
        accountId: account.name,
        accountName: account.display_name
      },
      companionComment: {
        id: companion_comment.id,
        text: companion_comment.text,
        companionId: companion.id,
        companionName: companion.name
      }
    })
  end
end
