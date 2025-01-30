class CompanionsController < ApplicationController
  before_action :set_companion, only: %i[ show update destroy ]

  def index
    @companions = Companion.all

    render json: @companions
  end

  def show
    render json: @companion
  end

  def create
    @companion = Companion.new(companion_params)

    if @companion.save
      render json: @companion, status: :created, location: @companion
    else
      render json: @companion.errors, status: :unprocessable_entity
    end
  end

  def update
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
      params.expect(companion: [ :description, :prompt, :published_at, :account_id ])
    end
end
