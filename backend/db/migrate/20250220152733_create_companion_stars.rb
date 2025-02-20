class CreateCompanionStars < ActiveRecord::Migration[8.0]
  def change
    create_table :companion_stars do |t|
      t.references :companion, null: false, foreign_key: true
      t.references :account, null: false, foreign_key: true

      t.timestamps
    end

    add_index :companion_stars, [ :companion_id, :account_id ], unique: true
  end
end
