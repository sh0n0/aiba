class CreateCompanionTools < ActiveRecord::Migration[8.0]
  def change
    create_table :companion_tools do |t|
      t.string :name, null: false
      t.string :description, null: false
      t.string :url, null: false
      t.references :companion, null: false, foreign_key: true

      t.timestamps
    end

    add_index :companion_tools, [ :name, :companion_id ], unique: true
  end
end
