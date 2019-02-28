class AddZoomMatchingEnrollmentsToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :zoom_matching_enrollments, :json
  end
end
