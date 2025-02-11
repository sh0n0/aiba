class CreateCompanionToolParams < ActiveRecord::Migration[8.0]
  def change
    create_table :companion_tool_params do |t|
      create_enum :param_type, %w[string number array boolean]

      t.string :name, null: false
      t.string :description, null: false
      t.enum :param_type, null: false, enum_type: :param_type
      t.references :companion_tool, null: false, foreign_key: true

      t.timestamps
    end
  end
end
