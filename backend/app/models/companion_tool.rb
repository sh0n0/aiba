class CompanionTool < ApplicationRecord
  belongs_to :companion
  has_many :companion_tool_params

  validates :name, presence: true
  validates :description, presence: true

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
