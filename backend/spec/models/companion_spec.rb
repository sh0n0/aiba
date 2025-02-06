require "rails_helper"

RSpec.describe Companion do
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
