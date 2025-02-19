require 'rails_helper'

RSpec.describe TweetsController, type: :request do
  describe 'POST /tweets' do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }

    context 'with valid params' do
      let(:params) { { tweet: { text: 'Hello, world!' } } }

      it 'creates a tweet' do
        expect {
          post '/tweets', headers: auth_headers(user), params: params
        }.to change { account.tweets.count }.by(1)
        expect(response).to have_http_status(201)
      end
    end

    context 'with invalid params' do
      let(:params) { { tweet: { text: nil } } }

      it 'returns errors' do
        post '/tweets', headers: auth_headers(user), params: params
        expect(response).to have_http_status(422)
      end
    end

    context 'when not authenticated' do
      let(:params) { { tweet: { text: 'Hello, world!' } } }

      it 'returns an unauthorized error' do
        post '/tweets', params: params
        expect(response).to have_http_status(401)
      end
    end
  end
end
