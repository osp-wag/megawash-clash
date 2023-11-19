import { addCard, getCards } from "./cards"
import { mockCards } from "./mock-cards"
import mockReadline from "../__mocks__/readline-sync"
import fs from 'fs'

console.log = jest.fn()
jest.spyOn(fs, 'appendFileSync').mockImplementationOnce(jest.fn())

describe('cards', () => {
    it('should correctly load up cards', () => {
        const cards = getCards()
        expect(cards[0]).toEqual(mockCards[0])
        expect(cards[1]).toEqual(mockCards[1])
    })

    it('should correctly create a card', () => {
        const question = mockReadline.question as jest.Mock
        question.mockImplementationOnce(() => "Test name")
        question.mockImplementationOnce(() => "Test brand")
        question.mockImplementationOnce(() => "1500")
        question.mockImplementationOnce(() => "A+++")
        question.mockImplementationOnce(() => "30")
        question.mockImplementationOnce(() => "8.5")
        question.mockImplementationOnce(() => "go back")
        question.mockImplementationOnce(() => "exit")
        addCard()
        expect(console.log).toHaveBeenLastCalledWith(expect.stringContaining("Card inserted successfully"))
    })
})