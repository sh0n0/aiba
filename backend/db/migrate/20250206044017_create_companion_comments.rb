class CreateCompanionComments < ActiveRecord::Migration[8.0]
  def change
    create_table :companion_comments do |t|
      t.text :text
      t.references :companion, null: false, foreign_key: true
      t.references :tweet, null: false, foreign_key: true

      t.timestamps
    end
  end
end
