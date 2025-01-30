class CreateCompanions < ActiveRecord::Migration[8.0]
  def change
    create_table :companions do |t|
      t.string :name, null: false
      t.string :description, null: false
      t.text :prompt, null: false
      t.datetime :published_at
      t.references :account, null: false, foreign_key: true

      t.timestamps
    end
  end
end
