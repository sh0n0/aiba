RSpec.describe CompanionsController, type: :request do
  describe 'GET /companions/:account_name/:companion_name' do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }
    let!(:companion) { create(:companion, creator: account) }
    let!(:companion_ownership) { create(:companion_ownership, account: account, companion: companion) }

    context 'when the companion exists' do
      it 'returns the companion' do
        get "/companions/#{account.name}/#{companion.name}", headers: auth_headers(user)
        expect(response).to have_http_status(200)
        expect(response.parsed_body['name']).to eq(companion.name)
      end
    end

    context 'when the companion does not exist' do
      it 'returns a 404' do
        get "/companions/#{account.name}/nonexistent", headers: auth_headers(user)
        expect(response).to have_http_status(404)
      end
    end

    context 'when the account does not exist' do
      it 'returns a 404' do
        get "/companions/nonexistent/#{companion.name}", headers: auth_headers(user)
        expect(response).to have_http_status(404)
      end
    end

    context 'when the companion is owned but not created by the account' do
      let!(:other_account) { create(:account) }
      let!(:other_companion) { create(:companion, creator: other_account) }
      let!(:other_companion_ownership) { create(:companion_ownership, account: other_account, companion: other_companion) }
      let!(:companion_ownership) { create(:companion_ownership, account: account, companion: other_companion) }

      it 'returns a 404' do
        get "/companions/#{account.name}/#{other_companion.name}", headers: auth_headers(user)
        expect(response).to have_http_status(404)
      end
    end
  end
end
