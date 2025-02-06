class BroadcastCompanionCommentJob
  include Sidekiq::Job

  # @param [Integer] companion_comment_id
  def perform(companion_comment_id)
    companion_comment = CompanionComment.find(companion_comment_id)
    TimelineBroadcaster.broadcast_comment_to_public(companion_comment)
  end
end
