class CreateCompanionToolOwnerships < ActiveRecord::Migration[8.0]
  def change
    create_table :companion_tool_ownerships do |t|
      t.references :account, null: false, foreign_key: true
      t.references :companion_tool, null: false, foreign_key: true

      t.timestamps
    end
  end
end
