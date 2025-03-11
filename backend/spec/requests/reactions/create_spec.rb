require 'sidekiq/testing'
require 'rails_helper'

RSpec.describe ReactionsController, type: :request do
  describe 'POST /tweets/:tweet_id/reactions' do
    before do
      Sidekiq::Testing.fake!
    end

    after do
      Sidekiq::Worker.clear_all
    end

    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }

    let!(:other_account) { create(:account) }
    let!(:other_user) { create(:user, account: other_account) }
    let!(:tweet) { create(:tweet, account: other_account) }

    context 'when the reaction is made by another user' do
      it 'creates a reaction and notifies the tweet author' do
        expect {
          post "/tweets/#{tweet.id}/reactions", headers: auth_headers(user), params: { reaction: { emoji: '👍' } }
        }.to change(BroadcastNotificationJob.jobs, :size).by(1)
        expect(response).to have_http_status(201)
        expect(tweet.reactions.count).to eq(1)
      end
    end

    context 'when the reaction is made by the tweet author' do
      it 'creates a reaction without notifying the tweet author' do
        expect {
          post "/tweets/#{tweet.id}/reactions", headers: auth_headers(other_user), params: { reaction: { emoji: '👍' } }
        }.to change(BroadcastNotificationJob.jobs, :size).by(0)
        expect(response).to have_http_status(201)
        expect(tweet.reactions.count).to eq(1)
      end
    end

    context 'when auth_headers is not passed' do
      it 'returns a 401' do
        post "/tweets/#{tweet.id}/reactions", params: { reaction: { emoji: '👍' } }
        expect(response).to have_http_status(401)
        expect(tweet.reactions.count).to eq(0)
      end
    end

    context 'when the tweet does not exist' do
      it 'returns a 404' do
        post "/tweets/0/reactions", headers: auth_headers(user), params: { reaction: { emoji: '👍' } }
        expect(response).to have_http_status(404)
        expect(tweet.reactions.count).to eq(0)
      end
    end

    context 'when the emoji is invalid' do
      it 'returns a 422' do
        post "/tweets/#{tweet.id}/reactions", headers: auth_headers(user), params: { reaction: { emoji: 'invalid' } }
        expect(response).to have_http_status(422)
        expect(tweet.reactions.count).to eq(0)
      end
    end

    context 'when the user has already reacted' do
      let!(:reaction) { create(:reaction, reactable: tweet, account: account, emoji: '👍') }

      it 'returns a 409' do
        post "/tweets/#{tweet.id}/reactions", headers: auth_headers(user), params: { reaction: { emoji: '👍' } }
        expect(response).to have_http_status(409)
        expect(tweet.reactions.count).to eq(1)
      end
    end

    context 'when auth_headers is not passed' do
      it 'returns a 401' do
        post "/tweets/#{tweet.id}/reactions", params: { reaction: { emoji: '👍' } }
        expect(response).to have_http_status(401)
        expect(tweet.reactions.count).to eq(0)
      end
    end
  end
end
