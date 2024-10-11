# frozen_string_literal: true

class ProcessController < ApplicationController
  def benchmark
    message1 = params[:message1]
    message2 = params[:message2]

    begin
      raise ArgumentError, 'Code Blocks cannot be empty' if message1.blank? || message2.blank?

      time = Benchmark.bm do |x|
        x.report('message1:') { SafeRuby.eval(message1) }
        x.report('message2:') { SafeRuby.eval(message2) }
      end

      # Respond with a success message
      render json: {
        code1:   {
          cpu_time:  format('%.10f', time.first.utime),
          real_time: format('%.10f', time.first.real)
        },
        code2:   {
          cpu_time:  format('%.10f', time.last.utime),
          real_time: format('%.10f', time.last.real)
        },
        success: true
      }, status: :ok
    rescue ArgumentError => e
      render json: { success: false, message: e.message }
    rescue StandardError => e
      puts e.inspect
      render json: { success: false, message: "Check your Code Block, #{remove_not_needed_output(e.message)}" }
    end
  end

  private

  def remove_not_needed_output(error_string)
    error_string.gsub(%r{/[^\s]+:\d+|eval}, '')
  end
end
