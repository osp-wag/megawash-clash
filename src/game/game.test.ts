import Player from "../player/player"
import Game from "./game"
import mockReadline from "../__mocks__/readline-sync"

console.log = jest.fn()
const question = mockReadline.question as jest.Mock

describe('game', () => {
    const game = new Game(3)

    it('print turn number -> should print the turn number', () => {
        game['printTurnNumber'](3)
        expect(console.log).toHaveBeenLastCalledWith('\n------------\nTURN NUMBER 3\n------------')
    })

    it('print leaderboard -> should print the leaderboard', () => {
        game['printLeaderboard']()
        expect(console.log).toHaveBeenCalledWith('LEADERBOARD:')
        game['players'].forEach(player => 
            expect(console.log).toHaveBeenCalledWith(`${player.name}: ${player.getCardAmount()} cards`)
        )
    })

    it('select starting player -> should randomly select the starting player', () => {
        const previousStartingPlayer = game['startingPlayer']  
        game['selectStartingPlayer']()
        const currentStartingPlayer = game['startingPlayer']
        expect(previousStartingPlayer).toBe(undefined)
        expect(typeof currentStartingPlayer === 'number')
        expect(previousStartingPlayer !== currentStartingPlayer).toBe(true)
    })

    it('init players -> should create players with the correct amount, assign 1 human player and the rest AI', () => {
        expect(!game['players'].length).toBe(true)
        game['initPlayers']()
        expect(game['players'].length).toBe(3)
        expect(game['players'].filter(({ type }) => type === 'Human').length).toBe(1)
        expect(game['players'].filter(({ type }) => type === 'AI').length).toBe(2)
    })

    it('shuffle cards -> should change the order of the cards', () => {
        game['initPlayers']()
        game['players'].forEach(player => {
            expect(player.getCardAmount()).toBe(0)
        })
        game['shuffleCards']()
    })

    it('deal cards -> should split cards evenly among players', () => {
        game['initPlayers']()
        game['players'].forEach(player => {
            expect(player.getCardAmount()).toBe(0)
        })
        game['dealCards']()
        game['players'].forEach(player => {
            expect(player.getCardAmount()).toBe(Math.floor(game['cards'].length / 3))
        })
    })

    it('increment starting player -> should increment the starting player', () => {
        game['selectStartingPlayer']()
        const currentStartingPlayer = game['startingPlayer']
        game['incrementStartingPlayer']()
        const newStartingPlayer = game['startingPlayer']
        expect(newStartingPlayer === currentStartingPlayer).not.toBe(true)
    })

    it('determine game winner -> should print the correct winning player based on numbers of cards', () => {
        game['initPlayers']()
        game['shuffleCards']()
        game['dealCards']()
        game['players'].forEach((player, index) => {
            for (let x = 0; x < index; x++) {
                player.removeTopCard()
            }
        })
        game['determineGameWinner']()
        expect(console.log).toHaveBeenLastCalledWith(`\nThe winner is ${game['players'][0].name}`)

    })

    it('choose feature -> AI Player -> should choose feature randomly', () => {
        const feature = game['chooseFeature'](new Player('AI', 'AI'))
        expect(['RPM', 'energyRating', 'fastestProgram', 'capacity'].includes(feature))
    })

    it('choose feature -> Human player -> should prompt player for feature', () => {
        question.mockImplementationOnce(() => "RPM")
        const feature = game['chooseFeature'](new Player('Human', 'Human'))
        expect(feature).toEqual("RPM")
    })
})