OpenAI.configure do |config|
  config.access_token = ENV.fetch("OPENAI_ACCESS_TOKEN") if ENV["OPENAI_ACCESS_TOKEN"].present?
  config.log_errors = true
end
