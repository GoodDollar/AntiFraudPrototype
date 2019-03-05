class AddZoomResponseDataToEnrollments < ActiveRecord::Migration[5.2]
  def change
    add_column :enrollments, :zoom_enrollment_successful, :boolean
    add_column :enrollments, :zoom_enrollment_response, :json
  end
end
