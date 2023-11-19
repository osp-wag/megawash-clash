import { Card } from "../cards/cards";

export type PlayerType = 'Human' | 'AI'

export interface IPlayer {
    type: PlayerType
    name: string
    setCards: (cards: Card[]) => void
    addCardsToBottom: (cards: Card[]) => void
    getTopCard: () => Card
    removeTopCard: () => Card
    getCardAmount: () => number
}

export default class Player implements IPlayer {
    type: PlayerType
    name: string
    private cards: Card[] = []


    constructor (type: PlayerType, name: string) {
        this.type = type
        this.name = name
    }

    setCards (cards: Card[]) {
        this.cards = cards
    }

    addCardsToBottom (cards: Card[]) {
        this.cards.push(...cards)
    }

    getTopCard(): Card {
        return this.cards[0]
    }

    removeTopCard(): Card {
        const card = { ...this.getTopCard() }
        this.cards = this.cards.slice(1)
        return card
    }

    getCardAmount(): number {
        return this.cards.length
    }

}

export const playersWithoutCardsFilter = (player: IPlayer) => player.getCardAmount() <= 0
export const playersWithCardsFilter = (player: IPlayer) => player.getCardAmount() >= 1