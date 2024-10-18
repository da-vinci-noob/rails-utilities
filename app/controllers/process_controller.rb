# frozen_string_literal: true

# Contains all the processes done for an utility
class ProcessController < ApplicationController
  include SandboxHelper

  def benchmark
    message1, message2 = benchmark_params.values_at(:message1, :message2)

    raise ArgumentError, 'Code Blocks cannot be empty' if message1.blank? || message2.blank?

    results = perform_benchmark(message1, message2)
    render_success(results)
  rescue ArgumentError => e
    render_blank_message(e.message)
  rescue SecurityError => e
    my_logger.fatal(e.inspect)
    display_security_message
  rescue SyntaxError, StandardError => e
    log_and_render_error(e)
  end

  private

  def benchmark_params
    params.require(:process).permit(:message1, :message2)
  end

  def remove_not_needed_output(error_string)
    error_string.gsub(/for module.+/im, '')
  end

  def perform_benchmark(message1, message2)
    sandbox, priv = setup_sandbox

    Benchmark.bm do |x|
      x.report('message1:') { sandbox.run(priv, message1) }
      x.report('message2:') { sandbox.run(priv, message2) }
    end
  end

  def render_success(results)
    render json: { code1: format_result(results.first), code2: format_result(results.last), success: true }, status: :ok
  end

  def format_result(result)
    {
      cpu_time:  format('%.10f', result.utime),
      real_time: format('%.10f', result.real)
    }
  end

  def render_blank_message(_message)
    render json: { success: false, message: '' }, status: :unprocessable_entity
  end

  # rubocop:disable Naming/MethodParameterName
  def log_and_render_error(e)
    my_logger.error e.inspect
    render json: {
      success: false,
      message: "Check your Code Block, #{e.class} - #{remove_not_needed_output(e.message)}"
    }, status: :unprocessable_entity
  end
  # rubocop:enable Naming/MethodParameterName

  def display_security_message
    render json: {
      success: false,
      message: 'Code Blocked, if you feel the command has no security risk. ' \
               'Open an issue with your command to whitelist the method'
    }, status: :forbidden
  end

  def my_logger
    @my_logger ||= Logger.new(Rails.root.join('log/errors.log'))
  end
end
