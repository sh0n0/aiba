require "rails_helper"

RSpec.describe Companion do
  describe '.published' do
    let!(:published_companion) { create(:companion, published_at: Time.current) }
    let!(:unpublished_companion) { create(:companion, published_at: nil) }

    it 'returns only companions with a non-nil published_at' do
      expect(Companion.published).to contain_exactly(published_companion)
    end
  end

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

  describe '#starred_count' do
    let!(:companion) { create(:companion) }

    context 'when the companion has no companion_stars' do
      it 'returns 0' do
        expect(companion.starred_count).to eq(0)
      end
    end

    context 'when the companion has companion_stars' do
      let!(:star_1) { create(:companion_star, companion: companion) }
      let!(:star_2) { create(:companion_star, companion: companion) }

      it 'returns the number of companion_stars' do
        expect(companion.starred_count).to eq(2)
      end
    end
  end

  describe '#starred_by?' do
    let!(:account) { create(:account) }
    let!(:companion) { create(:companion) }

    context 'when the companion is starred by the account' do
      let!(:star) { create(:companion_star, account: account, companion: companion) }

      it 'returns true' do
        expect(companion.starred_by?(account)).to be true
      end
    end

    context 'when the companion is not starred by the account' do
      let!(:star) { create(:companion_star, account: build(:account), companion: companion) }

      it 'returns false' do
        expect(companion.starred_by?(account)).to be false
      end
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
