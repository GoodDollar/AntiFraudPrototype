require "administrate/base_dashboard"

class LoginAttemptDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    id: Field::Number,
    uuid: Field::String.with_options(searchable: false),
    session_id: Field::String,
    user: Field::BelongsTo,
    facemap: Field::String.with_options(searchable: false),
    audit_trail_image: AuditTrailImageField,
    zoom_authenticate_response: JsonBlobField,
    zoom_authenticate_source_id: Field::String,
    successful?: Field::Boolean,
    created_at: Field::DateTime,
    updated_at: Field::DateTime
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = [
    :id,
    :user,
    :successful?
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = [
    :id,
    :session_id,
    :user,
    :successful?,
    :audit_trail_image,
    :zoom_authenticate_source_id,
    :zoom_authenticate_response,
    :created_at,
    :updated_at
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = [].freeze

  # Overwrite this method to customize how enrollments are displayed
  # across all pages of the admin dashboard.
  #
  # def display_resource(enrollment)
  #   "Enrollment ##{enrollment.id}"
  # end
end
