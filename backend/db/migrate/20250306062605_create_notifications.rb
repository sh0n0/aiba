class CreateNotifications < ActiveRecord::Migration[8.0]
  def change
    create_table :notifications do |t|
      t.references :notifiable, polymorphic: true, null: false
      t.references :to_account, null: false, foreign_key: { to_table: :accounts }
      t.references :from_account, null: false, foreign_key: { to_table: :accounts }
      t.datetime :read_at

      t.timestamps
    end
  end
end
