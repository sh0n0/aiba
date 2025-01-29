class CreateAccounts < ActiveRecord::Migration[8.0]
  def change
    create_table :accounts do |t|
      t.string :name, null: false, index: { unique: true }
      t.text :private_key, null: false
      t.text :public_key, null: false
      t.string :display_name

      t.timestamps
    end
  end
end
