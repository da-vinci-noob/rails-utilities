# frozen_string_literal: true

# Contains all the processes done for an utility
class ProcessController < ApplicationController
  def benchmark
    message1, message2 = benchmark_params.values_at(:message1, :message2)

    begin
      raise ArgumentError, 'Code Blocks cannot be empty' if message1.blank? || message2.blank?

      results = perform_benchmark(message1, message2)
      render_success(results)
    rescue ArgumentError => e
      render_blank_message(e.message)
    rescue StandardError => e
      log_and_render_error(e)
    end
  end

  private

  def benchmark_params
    params.require(:process).permit(:message1, :message2)
  end

  def remove_not_needed_output(error_string)
    error_string.gsub(%r{/[^\s]+:\d+|eval}, '')
  end

  def perform_benchmark(message1, message2)
    Benchmark.bm do |x|
      x.report('message1:') { SafeRuby.eval(message1) }
      x.report('message2:') { SafeRuby.eval(message2) }
    end
  end

  def render_success(results)
    render json: {
      code1:   {
        cpu_time:  format('%.10f', results.first.utime),
        real_time: format('%.10f', results.first.real)
      },
      code2:   {
        cpu_time:  format('%.10f', results.last.utime),
        real_time: format('%.10f', results.last.real)
      },
      success: true
    }, status: :ok
  end

  def render_blank_message(message)
    render json: { success: false, message: }
  end

  # rubocop:disable Naming/MethodParameterName
  def log_and_render_error(e)
    Rails.logger.error e.inspect
    render json: { success: false, message: "Check your Code Block, #{remove_not_needed_output(e.message)}" }
  end
  # rubocop:enable Naming/MethodParameterName
end
