require 'rails_helper'

RSpec.describe TweetsController, type: :request do
  describe 'GET /tweets' do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }

    context 'when tweets exist' do
      page_size = TweetsController.const_get(:TWEETS_PER_PAGE)

      let!(:tweets) { create_list(:tweet, 20, account: account) }
      let!(:companion) { create(:companion, creator: account) }
      before do
        tweets.each { |tweet| create(:companion_comment, companion: companion, tweet: tweet) }
      end

      it 'returns a paginated list of tweets' do
        get '/tweets'
        expect(response).to have_http_status(200)
        expect(response.parsed_body.size).to eq(page_size)
      end

      it 'returns the latest tweets' do
        get '/tweets'
        expect(response).to have_http_status(200)
        expect(response.parsed_body.first['id']).to eq(tweets.last.id)
        expect(response.parsed_body.last['id']).to eq(tweets[tweets.size - page_size].id)
      end

      it 'returns the account for each tweet' do
        get '/tweets'
        expect(response).to have_http_status(200)
        expect(response.parsed_body.first).to have_key('account')
      end

      it 'returns the companion comment with its companion and creator for each tweet' do
        get '/tweets'
        expect(response).to have_http_status(200)
        expect(response.parsed_body.first['companionComment']['companion']).to have_key('creator')
      end
    end

    context 'when tweets do not exist' do
      it 'returns an empty array' do
        get '/tweets'
        expect(response).to have_http_status(200)
        expect(response.parsed_body).to eq([])
      end
    end
  end
end
