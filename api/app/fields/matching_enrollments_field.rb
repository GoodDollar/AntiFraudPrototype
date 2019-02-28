require "administrate/field/base"

class MatchingEnrollmentsField < Administrate::Field::Base
  def to_s
    JSON.pretty_generate(data)
  end
end
