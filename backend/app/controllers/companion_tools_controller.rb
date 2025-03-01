class CompanionToolsController < ApplicationController
  before_action :set_companion_tool, only: %i[show update destroy]

  def index
    # FIXME
    @companion_tools = CompanionTool.all

    render json: @companion_tools
  end

  def owned
    render json: current_user.account.owned_companion_tools, each_serializer: CompanionToolSerializer, account: current_user.account
  end

  def show
    render json: @companion_tool
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

  def destroy
    @companion_tool.destroy
  end

  private

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
