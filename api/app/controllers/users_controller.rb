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

    if @enrollment.suspected_duplicate?
      render(
        status: :conflict,
        json: { errors: @enrollment.similar_enrollments.map { |e| e.to_s } }
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

    render json: @user
  end

  def login
    head :not_found
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
