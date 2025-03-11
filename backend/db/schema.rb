# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_03_06_062605) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  # Custom types defined in this database.
  # Note that some types may not work with other database engines. Be careful if changing database.
  create_enum "param_type", ["string", "number", "array", "boolean"]

  create_table "accounts", force: :cascade do |t|
    t.string "name", null: false
    t.text "private_key", null: false
    t.text "public_key", null: false
    t.string "display_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_accounts_on_name", unique: true
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "companion_comments", force: :cascade do |t|
    t.text "text"
    t.bigint "companion_id", null: false
    t.bigint "tweet_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["companion_id"], name: "index_companion_comments_on_companion_id"
    t.index ["tweet_id"], name: "index_companion_comments_on_tweet_id"
  end

  create_table "companion_companion_tools", force: :cascade do |t|
    t.bigint "companion_id", null: false
    t.bigint "companion_tool_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["companion_id", "companion_tool_id"], name: "idx_on_companion_id_companion_tool_id_1a5b23aa43", unique: true
    t.index ["companion_id"], name: "index_companion_companion_tools_on_companion_id"
    t.index ["companion_tool_id"], name: "index_companion_companion_tools_on_companion_tool_id"
  end

  create_table "companion_ownerships", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.bigint "companion_id", null: false
    t.boolean "is_default", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id", "companion_id"], name: "index_companion_ownerships_on_account_id_and_companion_id", unique: true
    t.index ["account_id"], name: "index_companion_ownerships_on_account_id", unique: true, where: "(is_default = true)"
    t.index ["companion_id"], name: "index_companion_ownerships_on_companion_id"
  end

  create_table "companion_tool_ownerships", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.bigint "companion_tool_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_companion_tool_ownerships_on_account_id"
    t.index ["companion_tool_id"], name: "index_companion_tool_ownerships_on_companion_tool_id"
  end

  create_table "companion_tool_params", force: :cascade do |t|
    t.string "name", null: false
    t.string "description", null: false
    t.enum "param_type", null: false, enum_type: "param_type"
    t.bigint "companion_tool_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["companion_tool_id"], name: "index_companion_tool_params_on_companion_tool_id"
  end

  create_table "companion_tools", force: :cascade do |t|
    t.string "name", null: false
    t.string "description", null: false
    t.string "url", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "created_by", null: false
    t.datetime "published_at"
    t.index ["name", "created_by"], name: "index_companion_tools_on_name_and_created_by", unique: true
  end

  create_table "companions", force: :cascade do |t|
    t.string "name", null: false
    t.string "description", null: false
    t.text "prompt", null: false
    t.datetime "published_at"
    t.bigint "created_by", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "notifications", force: :cascade do |t|
    t.string "notifiable_type", null: false
    t.bigint "notifiable_id", null: false
    t.bigint "to_account_id", null: false
    t.bigint "from_account_id", null: false
    t.datetime "read_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["from_account_id"], name: "index_notifications_on_from_account_id"
    t.index ["notifiable_type", "notifiable_id"], name: "index_notifications_on_notifiable"
    t.index ["to_account_id"], name: "index_notifications_on_to_account_id"
  end

  create_table "reactions", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.string "reactable_type", null: false
    t.bigint "reactable_id", null: false
    t.string "emoji", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id", "reactable_type", "reactable_id", "emoji"], name: "idx_on_account_id_reactable_type_reactable_id_emoji_3be4427d81", unique: true
    t.index ["account_id"], name: "index_reactions_on_account_id"
    t.index ["reactable_type", "reactable_id"], name: "index_reactions_on_reactable"
  end

  create_table "stars", force: :cascade do |t|
    t.string "starrable_type", null: false
    t.bigint "starrable_id", null: false
    t.bigint "account_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_stars_on_account_id"
    t.index ["starrable_type", "starrable_id"], name: "index_stars_on_starrable"
  end

  create_table "tweets", force: :cascade do |t|
    t.text "text", null: false
    t.bigint "account_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_tweets_on_account_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "provider", default: "email", null: false
    t.string "uid", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.boolean "allow_password_change", default: false
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.string "email"
    t.json "tokens"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "account_id", null: false
    t.index ["account_id"], name: "index_users_on_account_id"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "companion_comments", "companions"
  add_foreign_key "companion_comments", "tweets"
  add_foreign_key "companion_companion_tools", "companion_tools"
  add_foreign_key "companion_companion_tools", "companions"
  add_foreign_key "companion_ownerships", "accounts"
  add_foreign_key "companion_ownerships", "companions"
  add_foreign_key "companion_tool_ownerships", "accounts"
  add_foreign_key "companion_tool_ownerships", "companion_tools"
  add_foreign_key "companion_tool_params", "companion_tools"
  add_foreign_key "companion_tools", "accounts", column: "created_by"
  add_foreign_key "companions", "accounts", column: "created_by"
  add_foreign_key "notifications", "accounts", column: "from_account_id"
  add_foreign_key "notifications", "accounts", column: "to_account_id"
  add_foreign_key "reactions", "accounts"
  add_foreign_key "stars", "accounts"
  add_foreign_key "tweets", "accounts"
  add_foreign_key "users", "accounts"
end
