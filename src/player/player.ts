import { Card } from "../cards/cards";

export type PlayerType = 'Human' | 'AI'

interface IPlayer {
    setCards: (cards: Card[]) => void
    addCardsToBottom: (cards: Card[]) => void
    getTopCard: () => Card
    removeTopCard: () => void
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