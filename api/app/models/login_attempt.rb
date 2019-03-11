class LoginAttempt < ApplicationRecord
  belongs_to :user

  validates :user, presence: true
  validates :session_id, presence: true
  validates :facemap, presence: true
  validates :audit_trail_image, presence: true

  after_create :zoom_hydrate!

  def self.for_user(user, params)
    new(params.merge(user: user))
  end

  def successful?
    zoom_authenticate_response.try(:[], 'meta').try(:[], 'ok')
  end

  def zoom_authenticate_source_id
    user.zoom_enrollment_id
  end

  private

  def zoom_hydrate!
    reload

    self.zoom_authenticate_response = zoom_client.authenticate(
      login_attempt: self
    )

    self.save!
  end

  def zoom_client
    @zoom_client ||= ZoomClient.new
  end
end
