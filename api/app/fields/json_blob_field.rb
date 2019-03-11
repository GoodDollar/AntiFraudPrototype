require "administrate/field/base"

class JsonBlobField < Administrate::Field::Base
  def to_s
    JSON.pretty_generate(data)
  end
end
