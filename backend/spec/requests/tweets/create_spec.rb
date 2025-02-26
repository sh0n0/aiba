require 'sidekiq/testing'
require 'rails_helper'

RSpec.describe TweetsController, type: :request do
  describe 'POST /tweets' do
    before do
      Sidekiq::Testing.fake!
    end

    after do
      Sidekiq::Worker.clear_all
    end

    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }

    context 'with valid params' do
      context 'with a companion', :vcr do
        let!(:companion) { create(:companion, creator: account) }
        let!(:companion_ownership) { create(:companion_ownership, account: account, companion: companion) }
        let(:params) { { tweet: { text: 'Hello, world!' }, companion: { name: companion.name, creator: { name: account.name } } } }

        it 'creates a tweet' do
          expect {
            post '/tweets', headers: auth_headers(user), params: params
          }.to change { account.tweets.count }.by(1).and change(BroadcastTweetAndCompanionCommentJob.jobs, :size).by(1)
        end
      end

      context 'without a companion' do
        let(:params) { { tweet: { text: 'Hello, world!' }, companion: nil } }

        it 'creates a tweet' do
          expect {
            post '/tweets', headers: auth_headers(user), params: params
          }.to change { account.tweets.count }.by(1).and change(BroadcastTweetJob.jobs, :size).by(1)
        end
      end
    end

    context 'with invalid params' do
      let!(:companion) { create(:companion, creator: account) }
      let!(:companion_ownership) { create(:companion_ownership, account: account, companion: companion) }

      context 'with an invalid companion creator name' do
        let(:params) { { tweet: { text: 'Hello, world!' }, companion: { name: companion.name, creator: { name: 'invalid' } } } }

        it 'returns an error' do
          post '/tweets', headers: auth_headers(user), params: params
          expect(response).to have_http_status(404)
          expect(account.tweets.count).to eq(0)
        end
      end

      context 'with an invalid companion name' do
        let(:params) { { tweet: { text: 'Hello, world!' }, companion: { name: 'invalid', creator: { name: account.name } } } }

        it 'returns an error' do
          post '/tweets', headers: auth_headers(user), params: params
          expect(response).to have_http_status(404)
          expect(account.tweets.count).to eq(0)
        end
      end

      context 'with an invalid text' do
        let(:params) { { tweet: { text: nil }, companion: nil } }

        it 'returns errors' do
          post '/tweets', headers: auth_headers(user), params: params
          expect(response).to have_http_status(422)
          expect(account.tweets.count).to eq(0)
        end
      end
    end

    context 'when not authenticated' do
      let(:params) { { tweet: { text: 'Hello, world!' } } }

      it 'returns an unauthorized error' do
        post '/tweets', params: params
        expect(response).to have_http_status(401)
        expect(account.tweets.count).to eq(0)
      end
    end
  end
end
