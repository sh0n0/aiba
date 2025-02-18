require 'rails_helper'

RSpec.describe TweetSerializer do
  let(:account) { create(:account) }
  let(:tweet) { create(:tweet, account: account) }
  let(:companion) { create(:companion, creator: account) }
  let!(:companion_comment) { create(:companion_comment, companion: companion, tweet: tweet) }

  let(:serializer) { TweetSerializer.new(tweet) }
  let(:serialized_tweet) { serializer.serializable_hash }

  it 'includes the account with its name' do
    expect(serialized_tweet[:account]).to be_present
  end

  it 'includes the companion comment with its companion and creator' do
    expect(serialized_tweet[:companion_comment][:companion][:creator]).to be_present
  end
end
