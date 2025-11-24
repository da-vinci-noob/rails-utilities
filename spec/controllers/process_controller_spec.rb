# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ProcessController do
  describe 'POST /process_benchmark' do
    context 'with empty code blocks' do
      it 'raises ArgumentError' do
        params = { process: { message1: '', message2: '' } }
        expected_json = { success: false, message: 'Code Blocks cannot be empty' }
        post(:benchmark, params:)
        expect(response).to have_http_status(:unprocessable_content)
        expect(response.parsed_body.symbolize_keys).to eq expected_json
      end
    end

    context 'with whitelisted code blocks' do
      it 'returns success response' do
        params = { process: { message1: 'puts "Hello World"', message2: 'print "Hello World"' } }
        post(:benchmark, params:)
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body).to match expected_success_json
      end
    end

    context 'with SecurityError exception' do
      it 'returns forbidden response' do
        params = { process: { message1: 'eval("system(\"echo hello\")")', message2: 'Running a shell command' } }
        post(:benchmark, params:)
        expect(response).to have_http_status(:forbidden)
        expect(response.parsed_body.symbolize_keys).to eq(expected_code_blocked_json)
      end
    end

    context 'with SyntaxError exception' do
      it 'returns unprocessable entity response' do
        params = { process: { message1: 'puts "hello', message2: 'invalid code' } }
        expected_json = { success: false, message: 'Check your Code Block, SyntaxError - compile error' }
        post(:benchmark, params:)
        expect(response).to have_http_status(:unprocessable_content)
        expect(response.parsed_body.symbolize_keys).to eq(expected_json)
      end
    end

    context 'with StandardError exception' do
      it 'returns unprocessable entity response' do
        params = { process: { message1: '"hello".test', message2: 'invalid code' } }
        expected_json = { success: false, message: 'Check your Code Block, NoMethodError - NoMethodError' }
        post(:benchmark, params:)
        expect(response).to have_http_status(:unprocessable_content)
        expect(response.parsed_body.symbolize_keys).to eq(expected_json)
      end
    end
  end
end

def expected_success_json
  {
    code1:   { cpu_time: /\d\.\d+/, real_time: /\d\.\d+/ },
    code2:   { cpu_time: /\d\.\d+/, real_time: /\d\.\d+/ },
    success: true
  }
end

def expected_code_blocked_json
  {
    success: false,
    message: 'Code Blocked, if you feel the command has no security risk. ' \
             'Open an issue with your command to whitelist the method'
  }
end
