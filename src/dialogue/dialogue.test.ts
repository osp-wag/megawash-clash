import mockReadline from "../__mocks__/readline-sync"
import createDialogue, { NumberOfPlayersAnswers } from "./dialogue"

const question = mockReadline.question as jest.Mock
console.log = jest.fn()

describe("dialogue", () => {
    it('it should reject invalid answer', () => {
        question.mockImplementationOnce(() => "Hello")
        // needed valid answer to break the loop
        question.mockImplementationOnce(() => '3')
        createDialogue<NumberOfPlayersAnswers>("numberOfPlayers") /* eslint-disable-line @typescript-eslint/no-unused-vars */
        expect(console.log).toHaveBeenLastCalledWith(expect.stringContaining("Invalid answer"))
    })

    it('should accept valid answer and return it', () => {
        question.mockImplementationOnce(() => '3')
        const answer = createDialogue<NumberOfPlayersAnswers>("numberOfPlayers")
        expect(answer).toEqual("3")
    })
})