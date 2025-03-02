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

  describe '#find_available_companion!' do
    let(:account) { create(:account) }
    let(:companion_1) { create(:companion) }
    let(:companion_2) { create(:companion) }
    let!(:ownership_1) { create(:companion_ownership, account: account, companion: companion_1) }
    let!(:ownership_2) { create(:companion_ownership, account: account, companion: companion_2) }

    context 'when a companion name and creator name are valid' do
      it 'returns the companion' do
        expect(account.find_available_companion!(companion_name: companion_1.name, creator_name: companion_1.creator.name)).to eq(companion_1)
      end
    end

    context 'when a companion name is invalid' do
      it 'raises an error' do
        expect { account.find_available_companion!(companion_name: 'invalid', creator_name: companion_1.creator.name) }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'when a creator name is invalid' do
      it 'raises an error' do
        expect { account.find_available_companion!(companion_name: companion_1.name, creator_name: 'invalid') }.to raise_error(ActiveRecord::RecordNotFound)
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
        expect(account.companions_count(account)).to eq(2)
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
        expect(account.companions_count(account)).to eq(0)
      end
    end

    context 'when companions created by the account are not published' do
      before do
        companion_1 = create(:companion, creator: account, published_at: nil)
        companion_2 = create(:companion, creator: account, published_at: nil)
        create(:companion_ownership, account: account, companion: companion_1)
        create(:companion_ownership, account: account, companion: companion_2)
      end

      context 'when the account is the same as the one passed in' do
        it 'returns the number of companions' do
          expect(account.companions_count(account)).to eq(2)
        end
      end

      context 'when the account is different from the one passed in' do
        it 'returns 0' do
          expect(account.companions_count(other_account)).to eq(0)
        end
      end
    end
  end

  describe '#companion_tools_count' do
    let!(:account) { create(:account) }
    let!(:other_account) { create(:account) }

    context 'when companion tools created by the account are present' do
      before do
        tool_1 = create(:companion_tool, creator: account)
        tool_2 = create(:companion_tool, creator: account)
        create(:companion_tool_ownership, account: account, companion_tool: tool_1)
        create(:companion_tool_ownership, account: account, companion_tool: tool_2)
      end

      it 'returns the number of companion tools' do
        expect(account.companion_tools_count(account)).to eq(2)
      end
    end

    context 'when companion tools created by the account are not present' do
      before do
        tool_1 = create(:companion_tool, creator: other_account)
        tool_2 = create(:companion_tool, creator: other_account)
        create(:companion_tool_ownership, account: other_account, companion_tool: tool_1)
        create(:companion_tool_ownership, account: other_account, companion_tool: tool_2)
        create(:companion_tool_ownership, account: account, companion_tool: tool_1)
        create(:companion_tool_ownership, account: account, companion_tool: tool_2)
      end

      it 'returns 0' do
        expect(account.companion_tools_count(account)).to eq(0)
      end
    end

    context 'when companion tools created by the account are not published' do
      before do
        tool_1 = create(:companion_tool, creator: account, published_at: nil)
        tool_2 = create(:companion_tool, creator: account, published_at: nil)
        create(:companion_tool_ownership, account: account, companion_tool: tool_1)
        create(:companion_tool_ownership, account: account, companion_tool: tool_2)
      end

      context 'when the account is the same as the one passed in' do
        it 'returns the number of companion tools' do
          expect(account.companion_tools_count(account)).to eq(2)
        end
      end

      context 'when the account is different from the one passed in' do
        it 'returns 0' do
          expect(account.companion_tools_count(other_account)).to eq(0)
        end
      end
    end
  end
end
