require 'rails_helper'

RSpec.describe CompanionsController, type: :request do
  describe 'POST /companions/:account_name/:companion_name/unpublish' do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }

    context 'when the companion is created by the account' do
      current_time = Time.current
      let!(:companion) { create(:companion, creator: account, published_at: current_time) }
      let!(:companion_ownership) { create(:companion_ownership, account: account, companion: companion) }

      it 'unpublishes the companion' do
        post "/companions/#{account.name}/#{companion.name}/unpublish", headers: auth_headers(user)
        expect(response).to have_http_status(200)
        expect { companion.reload }.to change { companion.published_at }.from(be_within(1.minute).of(current_time)).to(nil)
      end
    end

    context 'without auth headers' do
      let!(:companion) { create(:companion, creator: account, published_at: Time.current) }
      let!(:companion_ownership) { create(:companion_ownership, account: account, companion: companion) }

      it 'returns a 401' do
        post "/companions/#{account.name}/#{companion.name}/unpublish"
        expect(response).to have_http_status(401)
        expect(companion.reload.published_at).not_to be_nil
      end
    end

    context 'when the companion is not created by the account' do
      let!(:other_account) { create(:account) }
      let!(:other_user) { create(:user, account: other_account) }
      let!(:other_companion) { create(:companion, creator: other_account) }
      let!(:other_companion_ownership) { create(:companion_ownership, account: other_account, companion: other_companion) }

      it 'returns a 404' do
        post "/companions/#{account.name}/#{other_companion.name}/unpublish", headers: auth_headers(user)
        expect(response).to have_http_status(404)
        expect(other_companion.reload.published_at).not_to be_nil
      end
    end

    context 'when the companion is not published' do
      let!(:companion) { create(:companion, creator: account, published_at: nil) }
      let!(:companion_ownership) { create(:companion_ownership, account: account, companion: companion) }

      it 'returns a 409' do
        post "/companions/#{account.name}/#{companion.name}/unpublish", headers: auth_headers(user)
        expect(response).to have_http_status(409)
      end
    end

    context 'when the companion does not exist' do
      it 'returns a 404' do
        post "/companions/#{account.name}/nonexistent/unpublish", headers: auth_headers(user)
        expect(response).to have_http_status(404)
      end
    end

    context 'when the account does not exist' do
      let!(:companion) { create(:companion) }
      let!(:companion_ownership) { create(:companion_ownership, account: account, companion: companion) }

      it 'returns a 404' do
        post "/companions/nonexistent/#{companion.name}/unpublish", headers: auth_headers(user)
        expect(response).to have_http_status(404)
        expect(companion.reload.published_at).not_to be_nil
      end
    end
  end
end
