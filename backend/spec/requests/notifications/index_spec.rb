require 'rails_helper'

RSpec.describe NotificationsController, type: :request do
  let!(:account) { create(:account) }
  let!(:user) { create(:user, account: account) }

  describe 'GET /notifications' do
    context 'when notifications exist' do
      let!(:notifications) { create_list(:notification, 30, to_account: account) }

      it 'returns a paginated list of notifications' do
        get '/notifications', headers: auth_headers(user)
        expect(response).to have_http_status(200)
        expect(response.parsed_body['notifications'].size).to eq(NotificationsController::NOTIFICATIONS_PER_PAGE)
      end
    end

    context 'when notifications do not exist' do
      it 'returns an empty array' do
        get '/notifications', headers: auth_headers(user)
        expect(response).to have_http_status(200)
        expect(response.parsed_body['notifications']).to eq([])
      end
    end

    context 'when the user is not authenticated' do
      it 'returns 401' do
        get '/notifications'
        expect(response).to have_http_status(401)
      end
    end
  end
end
