import readlineSync from 'readline-sync'

const createDialogue = <T extends GameStartAnswers | NumberOfPlayersAnswers | MaxTurnsAnswers | CreateNewAnswers | ChooseFeatureAnswers | NextCardAnswers>(dialogue: keyof typeof DIALOGUES, lowercase = true): T => {
    const selectedDialogue = DIALOGUES[dialogue]
    let answer = ''
    let dirty = false
    while (!selectedDialogue.answers.some(validAnswer => validAnswer.toLowerCase() === answer.toLowerCase())) {
        if (dirty) {
            console.log(`Invalid answer. Valid answers are: ${selectedDialogue.answers.join(', ')}\n`)
        }
        answer = readlineSync.question(`${selectedDialogue.question}: `)
        dirty = true
    }
    
    return lowercase ? answer.toLowerCase() as T : answer as T
}
    
export default createDialogue

// allows us to specify what answers we are expecting when we are creating a dialogue (see usage)
// thanks to that we dont have to "guess" when making conditionals and validation can be automatic
const gameStartAnswers = ['play a game', 'add a new card', 'exit'] as const
export type GameStartAnswers = typeof gameStartAnswers[number]

const numberOfPlayersAnswers = ['3', '4', '5', '6', '7', '8'] as const
export type NumberOfPlayersAnswers = typeof numberOfPlayersAnswers[number]

const maxTurnsAnswers = ['no', ...Array(90).fill(10).map((x, index) => (x+index).toString()) ] as const
export type MaxTurnsAnswers = typeof maxTurnsAnswers[number]

const createNewAnswers = ['start a new game', 'go back'] as const
export type CreateNewAnswers = typeof createNewAnswers[number]

export const chooseFeatureAnswers = ['rpm', 'energyRating', 'fastestProgram', 'capacity'] as const
export type ChooseFeatureAnswers = typeof chooseFeatureAnswers[number]

export const nextTurnAnswers = ['yes', 'no'] as const
export type NextTurnAnswers = typeof nextTurnAnswers[number]

export const nextCardAnswers = ['create another card', 'go back'] as const
export type NextCardAnswers = typeof nextCardAnswers[number]

export const DIALOGUES = Object.freeze({
    gameStart: {
        question: 'Would you like to 1) play a game 2) add a new card 3) exit?',
        answers: gameStartAnswers
    },
    numberOfPlayers: {
        question: 'What should be the number of players (3-8)?',
        answers: numberOfPlayersAnswers
    },
    maxTurns: {
        question: 'Should there be a limit on amount of turns? 1) No 2) (10-100)',
        answers: maxTurnsAnswers
    },
    createNew: {
        question: 'Would you like to 1) Start a new game or 2) Go back?',
        answers: createNewAnswers
    },
    chooseFeature: {
        question: 'Which feature would you like to choose? (rpm, energyRating, fastestProgram, capacity)',
        answers: chooseFeatureAnswers
    },
    nextTurn: {
        question: "Are you ready for the next turn? (Yes = continue | No = exit)",
        answers: nextTurnAnswers
    },
    nextCard: {
        question: "Do you want to 1) create another card 2) go back?",
        answers: nextCardAnswers
    }
})
