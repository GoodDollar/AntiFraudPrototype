class UsersController < ApplicationController
  def create
    @enrollment = Enrollment.new(enrollment_params)

    if !@enrollment.save
      render(
        status: :unprocessable_entity,
        json: { errors: @enrollment.errors.full_messages }
      )
      return
    end

    if !@enrollment.zoom_enrollment_successful?
      render(
        status: :unprocessable_entity,
        json: {
          errors: [
            @enrollment.zoom_enrollment_response.try(:[], 'meta').try(:[], 'message'),
            @enrollment.zoom_similar_enrollments.try(:[], 'meta').try(:[], 'message')
          ].reject(&:blank?)
        }
      )
      return
    end

    if @enrollment.suspected_duplicate?
      render(
        status: :conflict,
        json: {
          similar_enrollments:@enrollment.zoom_similar_enrollments,
          users_from_similar_enrollments: @enrollment.zoom_users_from_similar_enrollments,
          errors: @enrollment.zoom_filtered_similar_enrollments.map do |similar|
            enrollment = Enrollment.where(uuid: e['enrollmentIdentifier']).take # access Enrollment table
            next unless enrollment && enrollment.user.present?

            "Too similar to #{enrollment.user.name}"
          end
        }
      )
      return
    end

    @user = User.new(user_params)

    if !@user.save
      render(
        status: :unprocessable_entity,
        json: { errors: @user.errors.full_messages }
      )
      return
    end

    @enrollment.user = @user
    @enrollment.save!

    render json: @user
  end

  def login
    @user = User.find_by_email(login_params[:email])

    if !@user
      render(
        status: :not_found,
        json: { errors: 'No user found with that email address' }
      )
      return
    end

    @login_attempt = LoginAttempt.for_user(@user, login_params.except(:email))

    if !@login_attempt.save
      render(
        status: :unprocessable_entity,
        json: { errors: @login_attempt.errors.full_messages }
      )
      return
    end

    if !@login_attempt.successful?
      render(
        status: :unauthorized,
        json: { errors: 'Supplied face does not match that user' }
      )
      return
    end

    render json: @user
  end

  private

  def enrollment_params
    params.permit(
      :name,
      :email,
      :session_id,
      :facemap,
      :audit_trail_image
    ).tap do |p|
      p[:facemap].rewind
      p[:audit_trail_image].rewind

      p[:facemap] = p[:facemap].read
      p[:audit_trail_image] = p[:audit_trail_image].read
    end
  end

  def login_params
    params.permit(
      :email,
      :session_id,
      :facemap,
      :audit_trail_image
    ).tap do |p|
      p[:facemap].rewind
      p[:audit_trail_image].rewind

      p[:facemap] = p[:facemap].read
      p[:audit_trail_image] = p[:audit_trail_image].read
    end
  end

  def user_params
    params.permit(
      :name,
      :email
    )
  end
end
