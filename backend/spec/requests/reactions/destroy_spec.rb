require 'rails_helper'

RSpec.describe ReactionsController, type: :request do
  describe 'DELETE /tweets/:tweet_id/reactions' do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }

    let!(:other_account) { create(:account) }
    let!(:tweet) { create(:tweet, account: other_account) }
    let!(:reaction1) { create(:reaction, reactable: tweet, account: account, emoji: '👍') }
    let!(:reaction2) { create(:reaction, reactable: tweet, account: other_account, emoji: '👍') }
    let!(:reaction3) { create(:reaction, reactable: tweet, account: account, emoji: '👎') }

    context 'when the tweet exists' do
      it 'deletes the correct reaction' do
        delete "/tweets/#{tweet.id}/reactions", headers: auth_headers(user), params: { reaction: { emoji: '👍' } }
        expect(response).to have_http_status(204)
        expect(tweet.reactions.where(account: account, emoji: '👍').count).to eq(0)
        expect(tweet.reactions.where(emoji: '👍', account: other_account).count).to eq(1)
        expect(tweet.reactions.where(emoji: '👎', account: account).count).to eq(1)
      end
    end

    context 'when the emoji is invalid' do
      it 'returns a 404' do
        delete "/tweets/#{tweet.id}/reactions", headers: auth_headers(user), params: { reaction: { emoji: 'invalid' } }
        expect(response).to have_http_status(404)
        expect(tweet.reactions.count).to eq(3)
      end
    end

    context 'when the tweet does not exist' do
      it 'returns a 404' do
        delete "/tweets/0/reactions", headers: auth_headers(user), params: { reaction: { emoji: '👍' } }
        expect(response).to have_http_status(404)
        expect(tweet.reactions.count).to eq(3)
      end
    end

    context 'when the user has not reacted' do
      it 'returns a 404' do
        delete "/tweets/#{tweet.id}/reactions", headers: auth_headers(user), params: { reaction: { emoji: '❤️' } }
        expect(response).to have_http_status(404)
        expect(tweet.reactions.count).to eq(3)
      end
    end
  end
end
