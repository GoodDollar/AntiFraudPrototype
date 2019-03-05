class ZoomClient
  ZoomError = Class.new(StandardError)

  def create_enrollment(enrollment:)
    handle_response(
      faraday.post(
        'enrollment',
        {
          body: {
            enrollmentIdentifier: enrollment.uuid,
            facemap: enrollment.facemap,
            sessionId: enrollment.session_id,
            auditTrailImage: enrollment.audit_trail_image,
          }
        }
      )
    ).except(:facemap, :auditTrailImage)
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
          body: {
            sessionId: enrollment.session_id,
            enrollmentIdentifier: enrollment.uuid
          }
        }
      )
    ).except(:auditTrailImage)
  end

  private

  def handle_response(response)
    response.body[:body]
  end

  def faraday
    @faraday ||= Faraday.new(
      url: 'https://api.zoomauth.com/api/v1/biometrics',
      headers: {
        'X-App-Token' => 'd4QcD1WU4s5srMoJeDe2YDIIvy2AaMI0'
      },
    ) do |fday|
      fday.request(:multipart)
    end
  end
end
