class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string :name
      t.string :email
      t.string :enrollment_ids, array: true, default: []

      t.timestamps
    end
  end
end
