class CompanionToolsController < ApplicationController
  before_action :authenticate_user!, only: %i[ create update destroy publish unpublish ]
  before_action :set_companion_tool, only: %i[update destroy]

  def index
    # FIXME
    @companion_tools = CompanionTool.all

    render json: @companion_tools
  end

  def owned
    render json: current_user.account.owned_companion_tools, each_serializer: CompanionToolSerializer, account: current_user.account
  end

  def show
    current_user_account = current_user&.account
    account = Account.find_by!(name: params[:account_name])

    companion_tool = CompanionTool
    companion_tool = companion_tool.published unless account == current_user_account
    companion_tool = companion_tool.created_by(account).with_name(params[:tool_name]).first!

    render json: companion_tool, serializer: CompanionToolDetailSerializer, account: current_user_account
  end

  def create
    account = current_user.account
    companion_tool = CompanionTool.new(
      name: companion_tool_params[:name],
      description: companion_tool_params[:description],
      url: companion_tool_params[:url],
      creator: account
    )
    companion_tool_params[:params].each do |param|
      companion_tool.companion_tool_params.build(param)
    end

    account.owned_companion_tools << companion_tool

    if companion_tool.save
      render json: companion_tool, status: :created
    else
      render json: companion_tool.errors, status: :unprocessable_entity
    end
  end

  def update
    if @companion_tool.update(companion_tool_params)
      render json: @companion_tool
    else
      render json: @companion_tool.errors, status: :unprocessable_entity
    end
  end

  def publish
    change_publication_state do |companion_tool|
      return render status: :conflict if companion_tool.published_at.present?
      companion_tool.publish!
    end
  end

  def unpublish
    change_publication_state do |companion_tool|
      return render status: :conflict if companion_tool.published_at.nil?
      companion_tool.unpublish!
    end
  end

  def destroy
    @companion_tool.destroy
  end

  private

  def change_publication_state
    account = Account.find_by!(name: params[:account_name])
    return render status: :forbidden if account != current_user.account

    companion_tool = CompanionTool.created_by(account).with_name(params[:tool_name]).first
    return render status: :not_found if companion_tool.nil?

    yield companion_tool

    render json: companion_tool, serializer: CompanionToolDetailSerializer, account: current_user.account
  end

  def set_companion_tool
    account = Account.find_by!(name: params[:account_name])
    @companion_tool = CompanionTool.find(name: params[:name], creator: account)
  end

  def companion_tool_params
    params.require(:companion_tool).permit(
      :name,
      :description,
      :url,
      params: [ [ :name, :description, :param_type ] ]
    )
  end
end
