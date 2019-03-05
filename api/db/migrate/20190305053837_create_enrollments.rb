class CreateEnrollments < ActiveRecord::Migration[5.2]
  def change
    create_table :enrollments do |t|
      t.string :email
      t.string :name
      t.binary :facemap
      t.binary :audit_trail_image

      t.timestamps
    end
  end
end
