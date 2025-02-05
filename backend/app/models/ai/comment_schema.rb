class Ai::CommentSchema < Ai::BaseSchema
  def initialize
    super do
      string :comment
    end
  end
end
