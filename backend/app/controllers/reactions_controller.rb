class ReactionsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_tweet

  def create
    reaction = @tweet.reactions.find_or_initialize_by(account: current_user.account, emoji: reaction_params[:emoji])

    if reaction.persisted?
      render json: {}, status: :conflict
    elsif reaction.save
      BroadcastReactionJob.perform_async(reaction.id, "attach")
      NotificationService.new.call(reaction, @tweet.account, current_user.account)
      render json: {}, status: :created
    else
      render json: {}, status: :unprocessable_entity
    end
  end

  def destroy
    reaction = @tweet.reactions.find_by(account: current_user.account, emoji: reaction_params[:emoji])

    if reaction
      BroadcastReactionJob.perform_async(reaction.id, "detach")
      render json: {}, status: :no_content
    else
      render json: {}, status: :not_found
    end
  end

  private

  def set_tweet
    @tweet = Tweet.find(params[:tweet_id])
  end

  def reaction_params
    params.expect(reaction: %i[emoji])
  end
end
