require 'sidekiq/testing'
require 'rails_helper'

RSpec.describe ReactionsController, type: :request do
  describe 'DELETE /tweets/:tweet_id/reactions' do
    before do
      Sidekiq::Testing.fake!
    end

    after do
      Sidekiq::Worker.clear_all
    end

    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }

    let!(:other_account) { create(:account) }
    let!(:tweet) { create(:tweet, account: other_account) }
    let!(:reaction1) { create(:reaction, reactable: tweet, account: account, emoji: '👍') }
    let!(:reaction2) { create(:reaction, reactable: tweet, account: other_account, emoji: '👍') }
    let!(:reaction3) { create(:reaction, reactable: tweet, account: account, emoji: '👎') }

    context 'when the tweet exists' do
      it 'executes the job' do
        expect {
          delete "/tweets/#{tweet.id}/reactions", headers: auth_headers(user), params: { reaction: { emoji: '👍' } }
        }.to change(BroadcastReactionJob.jobs, :size).by(1)
        expect(response).to have_http_status(204)
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
