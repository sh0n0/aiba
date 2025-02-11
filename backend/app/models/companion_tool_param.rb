class CompanionToolParam < ApplicationRecord
  belongs_to :companion_tool

  validates :name, presence: true

  enum :param_type, { string: "string", number: "number", array: "array", boolean: "boolean" }

  def to_json_schema
    schema = {}
    schema[name.to_sym] = { type: param_type }
    schema[name.to_sym][:items] = { type: "string" } if array?
    schema
  end
end
