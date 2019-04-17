class Enrollment < ApplicationRecord
  belongs_to :user, optional: true

  validates :email, presence: true
  validates :name, presence: true
  validates :session_id, presence: true
  validates :facemap, presence: true
  validates :audit_trail_image, presence: true

  after_create :zoom_hydrate!
  after_destroy :zoom_destroy!

  def zoom_filtered_similar_enrollments  #find enrollments in our db with the same enrollment uuid. 
    return [] unless zoom_similar_enrollments.try(:[], 'data').try(:[], 'results')

    puts '1: accessed results'
    zoom_similar_enrollments['data']['results'].reject do |enrollment|
        match_level = ZoomSearchMatchLevel.new(enrollment['zoomSearchMatchLevel'])
        match_level.unreliable?
     end.select do |enrollment|
        puts '3'
        Enrollment.where(uuid: enrollment['enrollmentIdentifier']).any?
      end
  end

  
  def zoom_users_from_similar_enrollments #return list of the users of similar enrollments
    if !(zoom_similar_enrollments.try(:[], 'data').try(:[], 'results') )
     return []
    end 

    @@similar_enrollments = Array.new
    zoom_similar_enrollments['data']['results'].select do |enrollment|
      unless Enrollment.where(uuid: enrollment['enrollmentIdentifier']).empty? 
          # puts enrollment['enrollmentIdentifier']
          @@en = Enrollment.where(uuid: enrollment['enrollmentIdentifier']).first
          
          @@enjson = ({
              name: @@en['name'],
              mail: @@en['email'],
              uuid: @@en['uuid'],
              matching_score:enrollment['zoomSearchMatchLevel'],

          }).to_json
          @@similar_enrollments.push(@@enjson)
      end
    end
    return @@similar_enrollments

  end
   

  def suspected_duplicate?
    return true if !zoom_similar_enrollments['meta']['ok']

    puts "suspected_duplicate? #{zoom_filtered_similar_enrollments.any?}"
    puts "zoom_filtered_similar_enrollments from suspected duplicates #{zoom_filtered_similar_enrollments}"
    zoom_filtered_similar_enrollments.any?
  end

  private

  def zoom_hydrate!
    reload

    puts 'hydrating enrollment object..'

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
