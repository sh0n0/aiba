class CompanionsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_companion, only: %i[ update destroy ]

  def index
    companions = Companion.published
    render json: companions, each_serializer: CompanionSerializer, account: current_user.account
  end

  def owned
    render json: current_user.account.owned_companions, each_serializer: CompanionSerializer, account: current_user.account
  end

  def show
    current_user_account = current_user.account
    account = Account.find_by!(name: params[:account_name])

    companion = Companion
    companion = companion.published unless account == current_user_account
    companion = companion.created_by(account).with_name(params[:companion_name]).first!

    render json: companion, serializer: CompanionDetailSerializer, account: current_user_account
  end

  def create
    companion = Companion.new(name: companion_params[:name], description: companion_params[:description], prompt: companion_params[:prompt], creator: current_user.account)
    current_user.account.owned_companions << companion

    companion_params[:tools].each do |tool|
      companion_tool = CompanionTool.create!(name: tool[:name], description: tool[:description], url: tool[:url], companion: companion)
      tool[:params].each do |param|
        CompanionToolParam.create!(param.merge(companion_tool_id: companion_tool.id))
      end
    end

    if companion.save
      render json: companion, status: :created, location: @companion
    else
      render json: companion.errors, status: :unprocessable_entity
    end
  end

  def update
    unless @companion.editable_by?(current_user.account)
      render json: @companion.errors, status: :unprocessable_entity and return
    end

    if @companion.update(companion_params)
      render json: @companion
    else
      render json: @companion.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @companion.destroy!
  end

  private

  def set_companion
    @companion = Companion.find(params.expect(:id))
  end

  def companion_params
    params.expect(companion: [ :name, :description, :prompt, tools: [ [ :name, :description, :url, [ params: [ [ :name, :description, :param_type ] ] ] ] ] ])
  end
end
