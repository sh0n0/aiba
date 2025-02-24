class CreateReactions < ActiveRecord::Migration[8.0]
  def change
    create_table :reactions do |t|
      t.references :account, null: false, foreign_key: true
      t.references :reactable, polymorphic: true, null: false
      t.string :emoji, null: false

      t.timestamps
    end

    add_index :reactions, [ :account_id, :reactable_type, :reactable_id, :emoji ], unique: true
  end
end
