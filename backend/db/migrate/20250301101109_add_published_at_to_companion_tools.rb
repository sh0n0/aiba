class AddPublishedAtToCompanionTools < ActiveRecord::Migration[8.0]
  def change
    add_column :companion_tools, :published_at, :datetime
  end
end
