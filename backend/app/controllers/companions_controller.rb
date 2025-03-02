class CompanionsController < ApplicationController
  before_action :authenticate_user!, only: %i[ create update destroy publish unpublish ]
  before_action :set_companion, only: %i[ update destroy ]

  def index
    companions = Companion.published
    render json: companions, each_serializer: CompanionSerializer, account: current_user.account
  end

  def owned
    render json: current_user.account.owned_companions, each_serializer: CompanionSerializer, account: current_user.account
  end

  def show
    current_user_account = current_user&.account
    account = Account.find_by!(name: params[:account_name])

    companion = Companion
    companion = companion.published unless account == current_user_account
    companion = companion.created_by(account).with_name(params[:companion_name]).first!

    render json: companion, serializer: CompanionDetailSerializer, account: current_user_account
  end

  def create
    companion = Companion.new(
      name: companion_params[:name],
      description: companion_params[:description],
      prompt: companion_params[:prompt],
      creator: current_user.account
    )
    companion.companion_tools << CompanionTool.find_by_account_and_tool_pairs!(companion_params[:tools])
    current_user.account.owned_companions << companion

    if companion.save
      render json: companion, status: :created, location: companion
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

  def publish
    change_publication_state do |companion|
      return render status: :conflict if companion.published_at.present?
      companion.publish!
    end
  end

  def unpublish
    change_publication_state do |companion|
      return render status: :conflict if companion.published_at.nil?
      companion.unpublish!
    end
  end

  def destroy
    @companion.destroy!
  end

  private

  def change_publication_state
    account = Account.find_by!(name: params[:account_name])
    return render status: :forbidden if account != current_user.account

    companion = Companion.created_by(account).with_name(params[:companion_name]).first
    return render status: :not_found if companion.nil?

    yield companion

    render json: companion, serializer: CompanionDetailSerializer, account: current_user.account
  end

  def set_companion
    @companion = Companion.find(params.expect(:id))
  end

  def companion_params
    params.expect(companion: [
      :name,
      :description,
      :prompt,
      tools: [
        [ [ :creator_name, :tool_name ] ]
      ]
    ])
  end
end
