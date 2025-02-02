class SampleJob
  include Sidekiq::Job

  def perform(name)
    p "Sample Job: #{name}"
  end
end
