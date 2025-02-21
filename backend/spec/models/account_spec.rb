require 'rails_helper'

RSpec.describe Account, type: :model do
  describe '#default_companion' do
    let(:account) { create(:account) }
    let(:companion_1) { create(:companion) }
    let(:companion_2) { create(:companion) }

    context 'when a default companion is set' do
      before do
        create(:companion_ownership, account: account, companion: companion_1, is_default: false)
        create(:companion_ownership, account: account, companion: companion_2, is_default: true)
      end

      it 'returns the default companion' do
        expect(account.default_companion).to eq(companion_2)
      end
    end

    context 'when no default companion is set' do
      before do
        create(:companion_ownership, account: account, companion: companion_1, is_default: false)
        create(:companion_ownership, account: account, companion: companion_2, is_default: false)
      end
      it 'returns nil' do
        expect(account.default_companion).to be_nil
      end
    end
  end

  describe '#companions_count' do
    let!(:account) { create(:account) }
    let!(:other_account) { create(:account) }

    context 'when companions created by the account are present' do
      before do
        companion_1 = create(:companion, creator: account)
        companion_2 = create(:companion, creator: account)
        create(:companion_ownership, account: account, companion: companion_1)
        create(:companion_ownership, account: account, companion: companion_2)
      end

      it 'returns the number of companions' do
        expect(account.companions_count).to eq(2)
      end
    end

    context 'when companions created by the account are not present' do
      before do
        companion_1 = create(:companion, creator: other_account)
        companion_2 = create(:companion, creator: other_account)
        create(:companion_ownership, account: other_account, companion: companion_1)
        create(:companion_ownership, account: other_account, companion: companion_2)
        create(:companion_ownership, account: account, companion: companion_1)
        create(:companion_ownership, account: account, companion: companion_2)
      end

      it 'returns 0' do
        expect(account.companions_count).to eq(0)
      end
    end

    context 'when companions created by the account are not published' do
      before do
        companion_1 = create(:companion, creator: account, published_at: nil)
        companion_2 = create(:companion, creator: account, published_at: nil)
        create(:companion_ownership, account: account, companion: companion_1)
        create(:companion_ownership, account: account, companion: companion_2)
      end

      it 'returns 0' do
        expect(account.companions_count).to eq(0)
      end
    end
  end
end
