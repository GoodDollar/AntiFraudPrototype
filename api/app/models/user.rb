class User < ApplicationRecord
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: /@/
  validates :zoom_enrollment_id, presence: true, uniqueness: true

  after_destroy do
    zoom_client.delete_enrollment(enrollment_id: zoom_enrollment_id)
  end

  def audit_trail_image
    zoom_client.audit_trail_image(enrollment_id: zoom_enrollment_id)
  end

  private

  def zoom_client
    @zoom_client ||= ZoomClient.new
  end
end
