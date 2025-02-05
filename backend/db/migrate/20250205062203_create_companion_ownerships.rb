class CreateCompanionOwnerships < ActiveRecord::Migration[8.0]
  def change
    create_table :companion_ownerships do |t|
      t.references :account, null: false, foreign_key: true, index: false
      t.references :companion, null: false, foreign_key: true
      t.boolean :is_default, null: false, default: false

      t.timestamps
    end

    add_index :companion_ownerships, [ :account_id, :companion_id ], unique: true
    add_index :companion_ownerships, [ :account_id ], unique: true, where: "(is_default = true)"
  end
end
