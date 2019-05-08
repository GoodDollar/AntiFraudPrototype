class UsersController < ApplicationController
  def create
    puts "creating enrollment"
    @enrollment = Enrollment.new(enrollment_params)

    puts 'checking if can save enrollment'
    if !@enrollment.save
      render(
        status: :unprocessable_entity,
        json: { errors: @enrollment.errors.full_messages }
      )
      return
    end

    puts 'enrollment saved. checking if enrollment was successfull'
    if !@enrollment.zoom_enrollment_successful?
      puts 'zoom enrollment failed'
      render(
        status: :unprocessable_entity,
        json: {
          duplicates:@enrollment.zoom_similar_enrollments.try(:[], 'data').try(:[], 'results').present?,
          livenessFailed:!@enrollment.zoom_enrollment_response.try(:[], 'meta').try(:[], 'ok'),
          errors: [
            @enrollment.zoom_enrollment_response.try(:[], 'meta').try(:[], 'message'),
            @enrollment.zoom_similar_enrollments.try(:[], 'data').try(:[], 'results')
          ].reject(&:blank?)
        }
      )
      return
    end 

    puts 'checking for suspected duplicates'
    if @enrollment.suspected_duplicate?
      puts 'there are suspected duplicates'
      #puts "similar_enrollments #{@enrollment.zoom_similar_enrollments}"
      #puts "zoom_filtered_similar_enrollments #{@enrollment.zoom_filtered_similar_enrollments}"
      render(
        status: :conflict,
        json: {
          similar_enrollments: @enrollment.zoom_similar_enrollments,
          users_from_similar_enrollments: @enrollment.zoom_users_from_similar_enrollments,
          errors: @enrollment.zoom_filtered_similar_enrollments.map do |similar|
            puts "filtered similar enrollment #{similar}"
            enrollment = Enrollment.where(uuid: similar['enrollmentIdentifier']).take # access Enrollment table
            puts "enrollment.user #{enrollment.user.present?}" 
            next unless enrollment && enrollment.user.present?
            {message: "Too similar to registered user: #{enrollment.user.name}, #{enrollment.user.email}, uuid: #{enrollment.uuid}"}
            

          end
        }
      )
      puts "returning - user is not created"
      return
    end

    puts "creating new user #{user_params}"
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

    puts "user created #{@user.email}"
    render(
      status: :ok,
      json: {
              user: @user,
              users_from_similar_enrollments: @enrollment.zoom_users_from_similar_enrollments,
      })
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
        json: { errors: {message: @login_attempt.zoom_authenticate_response} }
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
