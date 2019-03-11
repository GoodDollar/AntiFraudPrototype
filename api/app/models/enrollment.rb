class Enrollment < ApplicationRecord
  THRESHOLD = 50.0

  belongs_to :user, optional: true

  validates :email, presence: true
  validates :name, presence: true
  validates :session_id, presence: true
  validates :facemap, presence: true
  validates :audit_trail_image, presence: true

  after_create :zoom_hydrate!
  after_destroy :zoom_destroy!

  def zoom_filtered_similar_enrollments
    return [] unless zoom_similar_enrollments.try(:[], 'data').try(:[], 'results')

    zoom_similar_enrollments['data']['results'].reject do |e|
      e['zoomSearchMatchLevel'].to_i < THRESHOLD
    end.select do |e|
      Enrollment.where(uuid: e['enrollmentIdentifier']).any?
    end
  end

  def suspected_duplicate?
    return true if !zoom_similar_enrollments['meta']['ok']

    zoom_filtered_similar_enrollments.any?
  end

  private

  def zoom_hydrate!
    reload

    self.zoom_enrollment_response = zoom_client.create_enrollment(enrollment: self)
    self.zoom_similar_enrollments = zoom_client.search(enrollment: self)
    self.zoom_enrollment_successful = zoom_enrollment_response.try(:[], 'meta').try(:[], 'ok') && zoom_similar_enrollments.try(:[], 'meta').try(:[], 'ok')

    self.save!
  end

  def zoom_destroy!
    zoom_client.delete_enrollment(enrollment_id: uuid)
  end

  def zoom_client
    @zoom_client ||= ZoomClient.new
  end
end
