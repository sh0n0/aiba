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

ActiveRecord::Schema[8.0].define(version: 2025_02_11_063416) do
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

  create_table "companion_comments", force: :cascade do |t|
    t.text "text"
    t.bigint "companion_id", null: false
    t.bigint "tweet_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["companion_id"], name: "index_companion_comments_on_companion_id"
    t.index ["tweet_id"], name: "index_companion_comments_on_tweet_id"
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
    t.bigint "companion_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["companion_id"], name: "index_companion_tools_on_companion_id"
    t.index ["name", "companion_id"], name: "index_companion_tools_on_name_and_companion_id", unique: true
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

  add_foreign_key "companion_comments", "companions"
  add_foreign_key "companion_comments", "tweets"
  add_foreign_key "companion_ownerships", "accounts"
  add_foreign_key "companion_ownerships", "companions"
  add_foreign_key "companion_tool_params", "companion_tools"
  add_foreign_key "companion_tools", "companions"
  add_foreign_key "companions", "accounts", column: "created_by"
  add_foreign_key "tweets", "accounts"
  add_foreign_key "users", "accounts"
end
