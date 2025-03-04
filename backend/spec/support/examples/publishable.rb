RSpec.shared_examples 'publishable' do
  describe '.published' do
    it 'returns only published records' do
      published = create(factory, published_at: Time.now.utc)
      unpublished = create(factory, published_at: nil)

      expect(subject.class.published).to include(published)
      expect(subject.class.published).not_to include(unpublished)
    end
  end

  describe '#publish!' do
    it 'sets published_at to current time' do
      time_now = Time.now.utc
      allow(Time).to receive(:now).and_return(time_now)

      subject.publish!

      expect(subject.published_at).to be_within(1.second).of(time_now)
    end
  end

  describe '#unpublish!' do
    it 'sets published_at to nil' do
      subject.update!(published_at: Time.now.utc)

      subject.unpublish!

      expect(subject.published_at).to be_nil
    end
  end
end
