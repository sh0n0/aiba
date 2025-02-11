# frozen_string_literal: true

require "singleton"

class Ai::OpenaiApi
  include Singleton

  def initialize
    @client = OpenAI::Client.new
  end

  # @param [String] prompt
  # @param [String] question
  # @param [Array<CompanionTool>] tools
  # @return [String]
  def generate_sentences(prompt, question, tools)
    messages = create_first_messages(prompt, question)
    response = @client.chat(parameters: create_params(messages, tools))
    message = response.dig("choices", 0, "message")

    if (content = message["content"]).present?
      JSON.parse(content)["comment"]
    elsif (tool_calls = message["tool_calls"]).present?
      messages << message

      tool_calls.each do |tool_call|
        tool_call_id = tool_call.dig("id")
        function_name = tool_call.dig("function", "name")
        function_args = JSON.parse(tool_call.dig("function", "arguments"), { symbolize_names: true })
        function_response = tools.find { |t| t.name == function_name }.execute(**function_args)

        messages << {
          tool_call_id: tool_call_id,
          role: "tool",
          name: function_name,
          content: function_response.to_s
        }
      end

      response = @client.chat(parameters: create_params(messages, nil))
      JSON.parse(response.dig("choices", 0, "message")["content"])["comment"]
    else
      raise "Unexpected response from OpenAI: #{response}"
    end
  end

  private

  def create_first_messages(prompt, question)
    [
      {
        role: "system",
        content: prompt
      },
      {
        role: "user",
        content: question
      }
    ]
  end

  def create_params(messages, tools)
    parameters = {
      model: "gpt-4o-mini",
      messages: messages,
      response_format: {
        type: "json_schema",
        json_schema: Ai::CommentSchema.new.to_hash
      }
    }
    parameters[:tools] = tools.map(&:to_json_schema) if tools.present?
    parameters
  end
end
