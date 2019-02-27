class User < ApplicationRecord
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: /@/
  validates :zoom_enrollment_id, presence: true, uniqueness: true

  def audit_trail_image
    ZoomClient.new.audit_trail_image(enrollment_id: zoom_enrollment_id).tap { |i| puts i }
  end
end
