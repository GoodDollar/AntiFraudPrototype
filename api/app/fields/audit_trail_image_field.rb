require "administrate/field/base"

class AuditTrailImageField < Administrate::Field::Base
  def to_s
    data
  end
end
