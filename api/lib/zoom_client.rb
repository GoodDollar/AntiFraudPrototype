class ZoomClient
  ZoomError = Class.new(StandardError)

  def create_enrollment(enrollment:)
    handle_response(
      faraday.post(
        'enrollment',
        {
          sessionId: enrollment.session_id,
          enrollmentIdentifier: enrollment.uuid,
          facemap: Faraday::UploadIO.new(StringIO.new(enrollment.facemap), 'application/zip'),
          auditTrailImage: Faraday::UploadIO.new(StringIO.new(enrollment.audit_trail_image), 'image/jpeg'),
        }
      )
    )
  end

  def delete_enrollment(enrollment_id:)
    handle_response(
      faraday.delete("enrollment/#{enrollment_id}")
    )
  end

  def search(enrollment:)
    handle_response(
      faraday.post(
        'search',
        {
          sessionId: enrollment.session_id,
          enrollmentIdentifier: enrollment.uuid
        }
      )
    ).tap do |response|
      if response.try(:[], 'data').try(:[], 'results')
        response['data']['results'].map! do |result|
          result.except('auditTrailImage')
        end
      end
    end
  end

  def authenticate(login_attempt:)
    handle_response(
      faraday.post(
        'authenticate',
        {
          sessionId: login_attempt.session_id,
          performContinuousLearning: true,
          source: {
            enrollmentIdentifier: login_attempt.zoom_source_id
          },
          targets: [
            {
              facemap: Faraday::UploadIO.new(StringIO.new(login_attempt.facemap), 'application/zip')
            }
          ]
        }
      )
    )
  end

  private

  def handle_response(response)
    response.body
  end

  def faraday
    @faraday ||= Faraday.new(
      url: 'https://api.zoomauth.com/api/v1/biometrics',
      headers: {
        'X-App-Token' => 'd4QcD1WU4s5srMoJeDe2YDIIvy2AaMI0'
      },
    ) do |fday|
      fday.request :multipart
      fday.request :url_encoded
      fday.response :json
      fday.adapter Faraday.default_adapter
    end
  end
end
