class ZoomClient
  ZoomError = Class.new(StandardError)

  MATCH_THRESHOLD = 70.freeze

  include HTTParty
  base_uri('https://api.zoomauth.com/api/v1/biometrics')
  headers({
    'X-App-Token' => 'd4QcD1WU4s5srMoJeDe2YDIIvy2AaMI0',
  })

  attr_reader :session_id

  def initialize(session_id: nil)
    @session_id = session_id
  end

  def audit_trail_image(enrollment_id:)
    handle_response(
      self.class.get("/enrollment/#{enrollment_id}?return=auditTrailImage")
    )['auditTrailImage']
  end

  def matching_enrollments(enrollment_id:)
    response = handle_response(
      self.class.post(
        '/search',
        {
          body: inject_session_id({ enrollmentIdentifier: enrollment_id })
        }
      )
    )

    response['results']
      .select { |result| result['matchScore'] > MATCH_THRESHOLD }
      .reject { |result| result['enrollmentIdentifier'] == enrollment_id }
      .map { |result| result['enrollmentIdentifier'] }
  end

  private

  def handle_response(response)
    response = response.parsed_response

    if !response['meta']['ok']
      raise ZoomError, "#{response['meta']['code']}: #{response['meta']['message']}"
    end

    response['data']
  end

  def inject_session_id(body)
    {
      sessionId: session_id
    }.merge(body)
  end
end
