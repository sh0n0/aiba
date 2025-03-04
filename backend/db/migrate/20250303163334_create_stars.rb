class CreateStars < ActiveRecord::Migration[8.0]
  def change
    drop_table :companion_stars

    create_table :stars do |t|
      t.references :starrable, polymorphic: true, null: false
      t.references :account, null: false, foreign_key: true

      t.timestamps
    end
  end
end
