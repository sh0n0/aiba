class BroadcastReactionJob
  include Sidekiq::Job

  # @param [Integer] reaction_id
  # @param [String] action_type
  def perform(reaction_id, action_type)
    reaction = Reaction.find(reaction_id)
    TimelineBroadcaster.broadcast_reaction_to_public(reaction, action_type)
    reaction.destroy if action_type == "detach"
  end
end
