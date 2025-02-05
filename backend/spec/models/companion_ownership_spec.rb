require 'rails_helper'

RSpec.describe CompanionOwnership, type: :model do
  let(:account) { create(:account) }
  let(:companion) { create(:companion) }

  describe 'validations' do
    context 'when valid attributes are provided' do
      it 'is valid' do
        companion_ownership = build(:companion_ownership, account: account, companion: companion, is_default: false)
        expect(companion_ownership).to be_valid
      end
    end

    context 'when there is already a companion ownership with default = true for the same account' do
      it 'is invalid' do
        create(:companion_ownership, account: account, companion: companion, is_default: true)
        new_ownership = build(:companion_ownership, account: account, companion: companion, is_default: true)

        expect(new_ownership).not_to be_valid
        expect(new_ownership.errors[:is_default]).not_to be_nil
      end
    end

    context 'when the account has multiple companion ownerships with default = false' do
      it 'is valid' do
        ownership1 = create(:companion_ownership, account: account, companion: companion, is_default: false)
        ownership2 = build(:companion_ownership, account: account, companion: create(:companion), is_default: false)

        expect(ownership2).to be_valid
      end
    end

    context 'when the account already owns the same companion' do
      it 'is invalid' do
        create(:companion_ownership, account: account, companion: companion, is_default: false)
        new_ownership = build(:companion_ownership, account: account, companion: companion, is_default: false)

        expect(new_ownership).not_to be_valid
        expect(new_ownership.errors[:account_id]).not_to be_nil
      end
    end
  end
end
