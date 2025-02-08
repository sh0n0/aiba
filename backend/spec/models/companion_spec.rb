require "rails_helper"

RSpec.describe Companion do
  describe ".published" do
    let!(:published_companion) { create(:companion, published_at: Time.current) }
    let!(:unpublished_companion) { create(:companion, published_at: nil) }

    it "returns only companions with a non-nil published_at" do
      expect(Companion.published).to contain_exactly(published_companion)
    end
  end

  describe ".with_name" do
    let!(:companion_1) { create(:companion, name: "Test Companion") }
    let!(:companion_2) { create(:companion, name: "Another Companion") }

    it "returns the companion with the given name" do
      expect(Companion.with_name("Test Companion")).to contain_exactly(companion_1)
    end
  end

  describe ".created_by" do
    let!(:account) { create(:account) }
    let!(:companion_1) { create(:companion, creator: account) }
    let!(:companion_2) { create(:companion, creator: build(:account)) }

    it "returns the companion created by the given account" do
      expect(Companion.created_by(account)).to contain_exactly(companion_1)
    end
  end

  context "when created by the same user" do
    it "is editable" do
      account = build(:account)
      companion = build(:companion, creator: account, published_at: nil)
      expect(companion.editable_by?(account)).to be true
    end
  end

  context "when created by a different user" do
    it "is not editable" do
      account = build(:account)
      companion = build(:companion, creator: build(:account), published_at: nil)
      expect(companion.editable_by?(account)).to be false
    end
  end

  context "when published" do
    it "is not editable" do
      account = build(:account)
      companion = build(:companion, creator: account, published_at: Time.now)
      expect(companion.editable_by?(account)).to be false
    end
  end

  context "when making a comment", :vcr do
    it "creates a new comment" do
      companion = build(:companion)
      tweet = build(:tweet)

      comment = companion.make_comment(tweet)
      expect(comment).to be_an_instance_of(CompanionComment)
    end
  end
end
