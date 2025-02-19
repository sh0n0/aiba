require 'rails_helper'

describe CompanionDetailSerializer do
  let(:creator) { create(:account) }
  let(:other_account) { create(:account) }
  let(:companion) { create(:companion, creator: creator) }
  let(:serializer) { CompanionDetailSerializer.new(companion, account: current_account) }
  let(:serialized) { serializer.serializable_hash }

  context 'when the current account is the creator' do
    let(:current_account) { creator }

    it 'includes the prompt' do
      expect(serialized[:prompt]).to eq(companion.prompt)
    end
  end

  context 'when the current account is not the creator' do
    let(:current_account) { other_account }

    it 'does not include the prompt' do
      expect(serialized[:prompt]).to be_nil
    end
  end
end
