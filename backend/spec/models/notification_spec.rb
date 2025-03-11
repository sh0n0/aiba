require 'rails_helper'

RSpec.describe Notification, type: :model do
  describe '.recent' do
    let!(:notification1) { create(:notification) }
    let!(:notification2) { create(:notification) }

    it 'returns notifications in descending order of id' do
      expect(Notification.recent).to eq([ notification2, notification1 ])
    end
  end

  describe ".to_account" do
    let!(:account) { create(:account) }
    let!(:other_account) { create(:account) }
    let!(:notification) { create(:notification, to_account: account) }
    let!(:other_notification) { create(:notification, to_account: other_account) }

    it "returns notifications for the given account" do
      expect(Notification.to_account(account)).to eq([ notification ])
    end
  end
end
