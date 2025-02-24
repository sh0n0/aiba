require 'rails_helper'

RSpec.describe Reaction, type: :model do
  describe '.grouped_by_emoji' do
    let!(:account1) { create(:account) }
    let!(:account2) { create(:account) }
    let!(:account3) { create(:account) }
    let!(:account4) { create(:account) }
    let!(:tweet) { create(:tweet, account: account4) }
    let!(:reaction1) { create(:reaction, reactable: tweet, account: account1, emoji: '👍') }
    let!(:reaction2) { create(:reaction, reactable: tweet, account: account2, emoji: '👍') }
    let!(:reaction3) { create(:reaction, reactable: tweet, account: account3, emoji: '👎') }

    it 'returns reactions grouped by emoji' do
      grouped_reactions = tweet.reactions.grouped_by_emoji(account1)
      first_target = grouped_reactions[0]
      second_target = grouped_reactions[1]

      expect(first_target[:emoji]).to eq('👍')
      expect(second_target[:emoji]).to eq('👎')
    end

    it 'returns reactions count' do
      grouped_reactions = tweet.reactions.grouped_by_emoji(account1)
      first_target = grouped_reactions[0]
      second_target = grouped_reactions[1]

      expect(first_target[:count]).to eq(2)
      expect(second_target[:count]).to eq(1)
    end

    it 'returns accounts' do
      grouped_reactions = tweet.reactions.grouped_by_emoji(account4)
      first_target = grouped_reactions[0]
      second_target = grouped_reactions[1]

      expect(first_target[:accounts][0][:name]).to eq(account1.name)
      expect(first_target[:accounts][1][:name]).to eq(account2.name)
      expect(second_target[:accounts][0][:name]).to eq(account3.name)
    end

    context 'when account has reacted' do
      it 'returns has_reacted as true' do
        grouped_reactions = tweet.reactions.grouped_by_emoji(account1)
        target = grouped_reactions[0]

        expect(target[:has_reacted]).to eq(true)
      end

      it 'does not return the account in the accounts array' do
        grouped_reactions = tweet.reactions.grouped_by_emoji(account1)
        target = grouped_reactions[0]

        expect(target[:accounts].count).to eq(1)
        expect(target[:accounts][0][:name]).to eq(account2.name)
      end
    end

    context 'when account has not reacted' do
      it 'returns has_reacted as false' do
        grouped_reactions = tweet.reactions.grouped_by_emoji(account1)
        target = grouped_reactions[1]

        expect(target[:has_reacted]).to eq(false)
      end
    end
  end

  describe '#emoji_must_be_single' do
    context 'when emoji is a single emoji' do
      it 'is valid' do
        reaction = build(:reaction, emoji: '👍')
        reaction.valid?
        expect(reaction.errors[:emoji]).to be_empty
      end
    end

    context 'when emoji is not a single emoji' do
      it 'is invalid' do
        reaction = build(:reaction, emoji: '👍👍')
        reaction.valid?
        expect(reaction.errors[:emoji]).not_to be_empty
      end
    end

    context 'when emoji is not an emoji' do
      it 'is invalid' do
        reaction = build(:reaction, emoji: 'invalid')
        reaction.valid?
        expect(reaction.errors[:emoji]).not_to be_empty
      end
    end
  end
end
