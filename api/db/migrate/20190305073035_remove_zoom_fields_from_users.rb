class RemoveZoomFieldsFromUsers < ActiveRecord::Migration[5.2]
  def change
    remove_column :users, :zoom_enrollment_id, :string
    remove_column :users, :zoom_matching_enrollments, :string
  end
end
