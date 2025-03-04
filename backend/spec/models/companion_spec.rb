require "rails_helper"

RSpec.describe Companion do
  subject { create(:companion) }
  let(:factory) { :companion }
  it_behaves_like "publishable"
  it_behaves_like "starrable"

  describe '.with_name' do
    let!(:companion_1) { create(:companion, name: "Test Companion") }
    let!(:companion_2) { create(:companion, name: "Another Companion") }

    it 'returns the companion with the given name' do
      expect(Companion.with_name("Test Companion")).to contain_exactly(companion_1)
    end
  end

  describe '.created_by' do
    let!(:account) { create(:account) }
    let!(:companion_1) { create(:companion, creator: account) }
    let!(:companion_2) { create(:companion, creator: build(:account)) }

    it "returns the companion created by the given account" do
      expect(Companion.created_by(account)).to contain_exactly(companion_1)
    end
  end

  describe '.recent' do
    let!(:companion_1) { create(:companion) }
    let!(:companion_2) { create(:companion) }

    it 'returns companions in descending order of id' do
      expect(Companion.recent).to eq([ companion_2, companion_1 ])
    end
  end

  describe '#editable_by?' do
    context 'when created by the same user' do
      it 'returns true' do
        account = build(:account)
        companion = build(:companion, creator: account, published_at: nil)
        expect(companion.editable_by?(account)).to be true
      end
    end

    context 'when created by a different user' do
      it 'returns false' do
        account = build(:account)
        companion = build(:companion, creator: build(:account), published_at: nil)
        expect(companion.editable_by?(account)).to be false
      end
    end

    context 'when the companion is published' do
      it 'returns false' do
        account = build(:account)
        companion = build(:companion, creator: account, published_at: Time.now)
        expect(companion.editable_by?(account)).to be false
      end
    end
  end

  describe '#make_comment', :vcr do
    context 'when making a comment' do
      it 'returns a new companion comment' do
        companion = build(:companion, prompt: "You are a companion")
        tweet = build(:tweet, text: "Hello, world!")

        comment = companion.make_comment(tweet)
        expect(comment).to be_an_instance_of(CompanionComment)
      end
    end
  end
end
