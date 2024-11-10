# frozen_string_literal: true

# Contains all the processes done for a utility
class ProcessController < ApplicationController
  include ProcessBenchmarkHelper

  def benchmark
    message1, message2 = benchmark_params.values_at(:message1, :message2)
    raise ArgumentError, 'Code Blocks cannot be empty' if message1.blank? || message2.blank?

    results = perform_benchmark(message1, message2)
    render_success(results)
  rescue ArgumentError => e
    render_blank_message(e.message)
  rescue SecurityError => e
    my_logger.fatal(e.inspect)
    render_security_message
  rescue SyntaxError, StandardError => e
    log_and_render_error(e)
  end
end
