# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_03_11_190514) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "uuid-ossp"

  create_table "enrollments", force: :cascade do |t|
    t.string "email"
    t.string "name"
    t.binary "facemap"
    t.binary "audit_trail_image"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "uuid", default: -> { "uuid_generate_v4()" }
    t.boolean "zoom_enrollment_successful"
    t.json "zoom_enrollment_response"
    t.string "session_id"
    t.json "zoom_similar_enrollments"
    t.bigint "user_id"
    t.index ["user_id"], name: "index_enrollments_on_user_id"
  end

  create_table "login_attempts", force: :cascade do |t|
    t.bigint "user_id"
    t.string "session_id"
    t.binary "facemap"
    t.binary "audit_trail_image"
    t.json "zoom_authenticate_response"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_login_attempts_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "enrollments", "users"
  add_foreign_key "login_attempts", "users"
end
