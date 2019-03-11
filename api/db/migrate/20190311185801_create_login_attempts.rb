class CreateLoginAttempts < ActiveRecord::Migration[5.2]
  def change
    create_table :login_attempts do |t|
      t.belongs_to :user, foreign_key: true
      t.string :session_id
      t.binary :facemap
      t.binary :audit_trail_image
      t.json :zoom_authenticate_response

      t.timestamps
    end
  end
end
