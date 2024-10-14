# frozen_string_literal: true

# Function to whitelist methods
module SandboxHelper
  include Shikashi

  def setup_sandbox
    sandbox = Sandbox.new
    priv = Privileges.new

    whitelisted_method_names.each do |method|
      priv.allow_method method
    end

    [sandbox, priv]
  end

  def whitelisted_method_names
    %i[puts print p map each to_a to_i to_f method_missing]
  end
end
