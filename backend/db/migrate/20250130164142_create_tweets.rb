class CreateTweets < ActiveRecord::Migration[8.0]
  def change
    create_table :tweets do |t|
      t.text :text, null: false
      t.references :account, null: false, foreign_key: true

      t.timestamps
    end
  end
end
