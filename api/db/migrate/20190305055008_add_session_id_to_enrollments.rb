class AddSessionIdToEnrollments < ActiveRecord::Migration[5.2]
  def change
    add_column :enrollments, :session_id, :string
  end
end
