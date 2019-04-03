class Enrollment < ApplicationRecord
  belongs_to :user, optional: true

  validates :email, presence: true
  validates :name, presence: true
  validates :session_id, presence: true
  validates :facemap, presence: true
  validates :audit_trail_image, presence: true

  after_create :zoom_hydrate!
  after_destroy :zoom_destroy!

  def zoom_filtered_similar_enrollments
    return [] unless   .try(:[], 'data').try(:[], 'results')

    zoom_similar_enrollments['data']['results'].map do |enrollment|
      enrollment.tap do |e|
        e['zoomSearchMatchLevel'] = ZoomSearchMatchLevel.new(e['zoomSearchMatchLevel'])
      end
    end.reject do |enrollment|
      enrollment['zoomSearchMatchLevel'].unreliable?
    end.select do |enrollment|
      Enrollment.where(uuid: enrollment['enrollmentIdentifier']).any?
    end
  end

  def zoom_populate_similar_enrollments
    return [] unless   .try(:[], 'data').try(:[], 'results')

    zoom_similar_enrollments['data']['results'].map do |enrollment|
      enrollment.tap do |e|
        e['zoomSearchMatchLevel'] = ZoomSearchMatchLevel.new(e['zoomSearchMatchLevel'])
      end
    end.select do |enrollment|
      User.where(id: Enrollment.where(uuid: enrollment['user_id']).any?).any?
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
