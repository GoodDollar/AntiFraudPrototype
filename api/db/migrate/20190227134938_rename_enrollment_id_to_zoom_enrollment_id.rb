class RenameEnrollmentIdToZoomEnrollmentId < ActiveRecord::Migration[5.2]
  def change
    change_column :users, :enrollment_ids, :string, array: false, default: nil
    rename_column :users, :enrollment_ids, :zoom_enrollment_id
  end
end
