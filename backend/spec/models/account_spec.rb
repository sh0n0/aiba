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
end
