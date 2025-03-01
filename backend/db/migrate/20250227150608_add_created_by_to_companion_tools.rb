class AddCreatedByToCompanionTools < ActiveRecord::Migration[8.0]
  def change
    add_column :companion_tools, :created_by, :bigint, null: false
    add_foreign_key :companion_tools, :accounts, column: :created_by
    add_index :companion_tools, [ :name, :created_by ], unique: true

    remove_reference :companion_tools, :companion, foreign_key: true, index: true
    remove_index :companion_tools, [ :name, :companion_id ], if_exists: true
  end
end
