class AddSimilarEnrollmentsToEnrollment < ActiveRecord::Migration[5.2]
  def change
    add_column :enrollments, :zoom_similar_enrollments, :json
  end
end
