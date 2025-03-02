class AccountController < ApplicationController
  before_action :set_account, only: %i[show tweets companions companion_tools]

  rescue_from Pagy::OverflowError, with: :not_found

  def show
    render json: @account, serializer: AccountSerializer, account: current_user&.account
  end

  def my
    render json: current_user.account, serializer: AccountSerializer
  end

  def avatar
    account = current_user.account
    account.avatar.attach(params.require(:avatar))
    account.save!
    render json: account, serializer: AccountSerializer
  end

  def tweets
    tweets = @account.tweets.recent.eager_load(:account, companion_comment: { companion: :creator })
    _, tweets = pagy(tweets, limit: TWEETS_PER_PAGE)
    render json: tweets, each_serializer: TweetSerializer
  end

  def companions
    companions = @account.created_companions.recent
    companions = companions.published unless @account == current_user&.account
    pagy, companions = pagy(companions, limit: COMPANIONS_PER_PAGE)
    render json: { companions: companions, page: pagy_metadata(pagy) }, each_serializer: CompanionSerializer
  end

  def companion_tools
    companion_tools = @account.created_companion_tools.recent
    companion_tools = companion_tools.published unless @account == current_user&.account
    pagy, companion_tools = pagy(companion_tools, limit: COMPANION_TOOLS_PER_PAGE)
    render json: { tools: companion_tools, page: pagy_metadata(pagy) }, each_serializer: CompanionToolSerializer
  end

  private

  def set_account
    @account = Account.find_by!(name: params.expect(:name))
  end
end
