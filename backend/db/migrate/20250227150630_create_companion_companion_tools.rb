class CreateCompanionCompanionTools < ActiveRecord::Migration[8.0]
  def change
    create_table :companion_companion_tools do |t|
      t.references :companion, null: false, foreign_key: true
      t.references :companion_tool, null: false, foreign_key: true

      t.timestamps
    end

    add_index :companion_companion_tools, [ :companion_id, :companion_tool_id ], unique: true
  end
end
