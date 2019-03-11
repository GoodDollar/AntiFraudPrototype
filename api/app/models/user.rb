class User < ApplicationRecord
  validates :name, presence: true
  validates :email, presence: true, format: /@/, uniqueness: true

  has_many :enrollments
  has_many :login_attempts

  def zoom_enrollment_id
    enrollments.first.uuid
  end
end
