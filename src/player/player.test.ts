import { mockCards } from "../cards/mock-cards"
import Player from "./player"

describe("player", () => {
    const player = new Player('AI', 'Test player')

    beforeEach(() => player.setCards(mockCards))

    afterEach(() => player.setCards([]))

    it('should correctly assign properties in the constructor', () => {
        const player = new Player('AI', 'Test name')
        expect(player.type).toEqual('AI')
        expect(player.name).toEqual('Test name')
    })

    it('should set the players cards when calling set cards', () => {
        player.setCards(mockCards)
        expect(player['cards'][0]).toEqual(mockCards[0])
        expect(player['cards'][1]).toEqual(mockCards[1])
    })

    it('should add cards to the bottom of players deck when caling addCardsToBottom', () => {
        player.setCards([mockCards[0]])
        player.addCardsToBottom([mockCards[1]])
        expect(player['cards'][1]).toEqual(mockCards[1])
    })

    it('should return the top card when calling get top card', () => {
        expect(player.getTopCard()).toEqual(mockCards[0])
    })

    it('should remove and return the top card of the players when calling remove top card', () => {
        player.removeTopCard()
        expect(player['cards'].length).toBe(1)
        expect(player['cards'][0]).toEqual(mockCards[1])
    })

    it('should return length of players deck when calling get card amount', () => {
        expect(player.getCardAmount()).toBe(2)
    })
})