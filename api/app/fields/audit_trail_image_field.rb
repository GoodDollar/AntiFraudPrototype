require "administrate/field/base"

class AuditTrailImageField < Administrate::Field::Base
  def base64_url
    "#{base64_prefix}#{base64_body}"
  end

  private

  def base64_prefix
    "data:image/jpeg;base64,"
  end

  def base64_body
    Base64.encode64(data)
  end
end
