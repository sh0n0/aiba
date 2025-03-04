RSpec.shared_examples "starrable" do
  let(:account) { create(:account) }

  describe '#starred_count' do
    context 'when there are no stars' do
      it 'returns 0' do
        expect(subject.starred_count).to eq(0)
      end
    end

    context 'when there are stars' do
      let!(:star1) { create(:star, starrable: subject) }
      let!(:star2) { create(:star, starrable: subject) }

      it "counts stars correctly" do
        expect(subject.starred_count).to eq(2)
      end
    end
  end

  describe "#starred_by?" do
    context "when starred by account" do
      before do
        create(:star, starrable: subject, account: account)
      end

      it "returns true" do
        expect(subject.starred_by?(account)).to be true
      end
    end

    context "when not starred by account" do
      before do
        create(:star, starrable: subject, account: create(:account))
      end

      it "returns false" do
        expect(subject.starred_by?(account)).to be false
      end
    end
  end
end
