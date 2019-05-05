class ZoomSearchMatchLevel
  def initialize(level_constant)
    @level_constant = level_constant
  end

  def quality
    case level
    when 0
      :medium_match
    when 1
      :low_match
    when 2
      :very_low_match
    else
      :no_match
    end
  end

  def unreliable?
    (quality != :medium_match)
  end

  private

  attr_reader :level_constant

  def level
    case level_constant
    when 'ZOOM_SEARCH_MATCH_LEVEL_0'
      0
    when 'ZOOM_SEARCH_MATCH_LEVEL_1'
      1
    when 'ZOOM_SEARCH_MATCH_LEVEL_2'
      2
    else
      3
    end
  end
end
