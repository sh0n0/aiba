class CreateCompanions < ActiveRecord::Migration[8.0]
  def change
    create_table :companions do |t|
      t.string :name, null: false
      t.string :description, null: false
      t.text :prompt, null: false
      t.datetime :published_at
      t.bigint :created_by, null: false
      t.foreign_key :accounts, column: :created_by

      t.timestamps
    end
  end
end
