require "Singleton"

class OpenaiApi
  include Singleton

  def initialize
    @client = OpenAI::Client.new
  end

  # @param [String] prompt
  # @param [String] question
  # @return [String]
  def make_sentences(prompt, question)
    response = @client.chat(parameters: {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: prompt
        },
        {
          role: "user",
          content: question
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: CommentSchema.new.to_hash
      }
    })
    json = JSON.parse(response["choices"].first["message"]["content"])
    json["comment"]
  end
end
