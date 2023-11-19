import Player from "../player/player"
import { Card, getCards } from "../cards/cards"
import createDialogue, { ChooseFeatureAnswers, CreateNewAnswers, MaxTurnsAnswers, NextTurnAnswers, NumberOfPlayersAnswers, chooseFeatureAnswers, nextTurnAnswers } from "../dialogue/dialogue"
import { random, shuffle } from "lodash"

interface IGame {
    start: () => void
}

export default class Game implements IGame {
    private players: Player[]
    private cards: Card[]
    private readonly numberOfPlayers: number
    private readonly maxTurns: number
    private startingPlayer: number

    constructor (numberOfPlayers: number, maxTurns: number = Number.MAX_VALUE) {
        this.maxTurns = maxTurns
        this.numberOfPlayers = numberOfPlayers
        this.cards = getCards()
    }

    start () {
        console.log('\n--------\nGAME STARTS\n--------')
        this.players = this.initPlayers()
        this.startingPlayer = random(0, this.players.length-1)
        this.shuffleCards()
        for (let turnNumber = 1; turnNumber < this.maxTurns; turnNumber++) {
            if (turnNumber > 1) {
                const ready = createDialogue<NextTurnAnswers>("nextTurn")
                if (ready === "no") break;
            }
            console.log(`\n--------\nTURN NUMBER ${turnNumber}\n--------`)
            this.playTurn()
            console.log('\nLEADERBOARD:')
            this.players.forEach(player => {
                console.log(`${player.name}: ${player.getCardAmount()} cards`)
            })
            if (this.players.length === 1) break;
        }
        this.players.sort((a, b) => b.getCardAmount() - a.getCardAmount())
        console.log(`The winner is ${this.players[0].name}`)
    }

    private playTurn () {
        const startingPlayer = this.players[this.startingPlayer]
        const chosenFeature = this.chooseFeature(startingPlayer)
        this.findWinner(this.players, chosenFeature)
        
        this.startingPlayer++
        if (this.startingPlayer >= this.players.length) this.startingPlayer = 0
        const eliminatedPlayers = this.players.filter(player => player.getCardAmount() <= 0).map(({ name }) => name).join(', ')
        if (eliminatedPlayers.length > 0) console.log(`\nThe following player(s) have been eliminated: ${eliminatedPlayers} `)
        this.players = this.players.filter(player => player.getCardAmount() > 0)

        while (this.startingPlayer >= this.players.length) {
            this.startingPlayer--
        }
    }

    private initPlayers() {
        const players = [new Player('Human', 'Human')]
        for (let i = 0; i < this.numberOfPlayers - 1; i++) {
            players.push(new Player('AI', `AI ${i + 1}`))
        }
        return players
    }

    private shuffleCards () {
        this.cards = shuffle(this.cards)
        const numberOfCardsForEachPlayer = Math.floor(this.cards.length / this.players.length)
        // give each player equally divided chunks of the whole deck
        this.players.forEach((player, index) => {
            player.setCards(this.cards.slice(numberOfCardsForEachPlayer*index, numberOfCardsForEachPlayer*(index+1)))
        })
    }

    private chooseFeature(player: Player): ChooseFeatureAnswers {
        const { name, type } = player
        const chosenFeature = type === 'Human' ? createDialogue<ChooseFeatureAnswers>('chooseFeature', false) : chooseFeatureAnswers[Math.floor(Math.random()*chooseFeatureAnswers.length)]
        console.log(`\n${name} has chosen to compare ${chosenFeature}!\n`)
        return chosenFeature
    }

    private findWinner(players: Player[], chosenFeature: ChooseFeatureAnswers, cardsToCollectPrevious: Card[] = []): Player {
       const sortedPlayers = [...players].sort((a, b) => b.getTopCard()[chosenFeature] - a.getTopCard()[chosenFeature])
       const highestValues = sortedPlayers.filter(player => player.getTopCard()[chosenFeature] === sortedPlayers[0].getTopCard()[chosenFeature])
       const cardsToCollect = [...cardsToCollectPrevious]
       players.forEach(player => {
        console.log(`${player.name}'s card has a ${chosenFeature} value of ${player.getTopCard()[chosenFeature]}`)
        cardsToCollect.push(player.removeTopCard())
       })
       if (highestValues.length > 1) {
        console.log('\nWe have a tiebreaker!!!!\n')
        return this.findWinner(highestValues, chosenFeature, cardsToCollect)
       }
       const winner = highestValues[0]
       console.log(`\nThe winner of this round is: ${winner.name}`)
       winner.addCardsToBottom(cardsToCollect)
       return winner
    }
}


export const gameSetup = () => {
    while (true) {
        const numberOfPlayers = createDialogue<NumberOfPlayersAnswers>("numberOfPlayers")
        const maxTurns = createDialogue<MaxTurnsAnswers>("maxTurns")
        const game = new Game(parseInt(numberOfPlayers), maxTurns === 'no' ? undefined : parseInt(maxTurns))
        game.start()
        const exitOrCreateNew = createDialogue<CreateNewAnswers>("createNew")
        if (exitOrCreateNew === 'go back') break;
    }
}