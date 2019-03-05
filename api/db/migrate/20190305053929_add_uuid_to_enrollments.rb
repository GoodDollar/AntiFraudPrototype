class AddUuidToEnrollments < ActiveRecord::Migration[5.2]
  def change
    enable_extension 'uuid-ossp'
    add_column :enrollments, :uuid, :uuid, default: 'uuid_generate_v4()'
  end
end
