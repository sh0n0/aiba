class CommentSchema < BaseSchema
  def initialize
    super do
      string :comment
    end
  end
end
