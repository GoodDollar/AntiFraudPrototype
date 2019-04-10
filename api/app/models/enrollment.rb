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
    return [] unless zoom_similar_enrollments.try(:[], 'data').try(:[], 'results')

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

  def zoom_users_from_similar_enrollments
    return [] unless zoom_similar_enrollments.try(:[], 'data').try(:[], 'results')

    zoom_similar_enrollments['data']['results'].map do |enrollment|
      enrollment.tap do |e|
        e['zoomSearchMatchLevel'] = ZoomSearchMatchLevel.new(e['zoomSearchMatchLevel'])
      end
    puts 'calculating zoom_users_from_similar_enrollments'
    puts enrollment 
    end.select do |enrollment|

      #self.zoom_users_from_similar_enrollments = 
       Enrollment.where(uuid: enrollment['enrollmentIdentifier']).map {|en| 
          en.try(:'.','email')
            #json: {
            # zoom_id: enrollment['enrollmentIdentifier'],
            # system_user: e.user,
            # matching_score:enrollment['zoomSearchMatchLevel']
            #}   
       }
       
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
