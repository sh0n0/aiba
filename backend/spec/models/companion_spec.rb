# frozen_string_literal: true

require "rails_helper"

RSpec.describe Companion do
  context "when created by the same user" do
    it "is editable" do
      account = FactoryBot.build(:account)
      companion = FactoryBot.build(:companion, creator: account, published_at: nil)
      expect(companion.editable_by?(account)).to be true
    end
  end

  context "when created by a different user" do
    it "is not editable" do
      account = FactoryBot.build(:account)
      companion = FactoryBot.build(:companion, creator: FactoryBot.build(:account), published_at: nil)
      expect(companion.editable_by?(account)).to be false
    end
  end

  context "when published" do
    it "is not editable" do
      account = FactoryBot.build(:account)
      companion = FactoryBot.build(:companion, creator: account, published_at: Time.now)
      expect(companion.editable_by?(account)).to be false
    end
  end
end
