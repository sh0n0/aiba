class CompanionTool < ApplicationRecord
  include Publishable
  include Starrable

  belongs_to :creator, class_name: "Account", foreign_key: :created_by

  has_many :companion_companion_tools
  has_many :companions, through: :companion_companion_tools

  has_many :companion_ownerships
  has_many :owners, through: :companion_ownerships, source: :account

  has_many :companion_tool_params

  validates :name, presence: true
  validates :description, presence: true

  scope :with_name, ->(name) { where(name: name) }
  scope :created_by, ->(account) { where(creator: account) }
  scope :recent, -> { order(id: :desc) }

  # @param [Array<Hash>] pairs
  # @return [Array<CompanionTool>]
  def self.find_by_account_and_tool_pairs!(pairs)
    accounts = Account.where(name: pairs.map { |p| p[:creator_name] }).includes(:created_companion_tools)

    pairs.map do |pair|
      account = accounts.find { |a| a.name == pair[:creator_name] }
      companion_tool = account&.created_companion_tools&.find { |ct| ct.name == pair[:tool_name] }

      raise ActiveRecord::RecordNotFound unless companion_tool

      companion_tool
    end
  end

  def to_json_schema
    {
      type: "function",
      function: {
        name: name,
        description: description,
        parameters: {
          type: :object,
          properties: companion_tool_params.map(&:to_json_schema).reduce(&:merge)
        }
      }
    }
  end

  def execute(**params)
    # FIXME: This is a temporary implementation
    uri = URI.parse(url)
    request = Net::HTTP::Post.new(uri, { "Content-Type" => "application/json" })
    request.body = params.to_json

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
      http.request(request)
    end

    JSON.parse(response.body)
  end
end
