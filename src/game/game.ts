import Player, { IPlayer, playersWithCardsFilter, playersWithoutCardsFilter } from "../player/player"
import { Card, getCards } from "../cards/cards"
import createDialogue, { ChooseFeatureAnswers, CreateNewAnswers, MaxTurnsAnswers, NextTurnAnswers, NumberOfPlayersAnswers, chooseFeatureAnswers } from "../dialogue/dialogue"
import { random, shuffle } from "lodash"

export default class Game {
    private players: IPlayer[]
    private cards: Card[]
    private readonly numberOfPlayers: number
    private readonly maxTurns: number
    private startingPlayer: number

    constructor (numberOfPlayers: number, maxTurns: number = Number.MAX_VALUE) {
        this.maxTurns = maxTurns
        this.numberOfPlayers = numberOfPlayers
        this.players = []
        this.cards = getCards()
    }

    start () {
        console.log('\n------------\nGAME STARTS\n------------')
        this.initPlayers()
        this.selectStartingPlayer()
        this.shuffleCards()
        this.dealCards()
        this.gameLoop()
        this.determineGameWinner()
    }

    private gameLoop () {
        for (let turnNumber = 1; turnNumber < this.maxTurns; turnNumber++) {
            this.printLeaderboard()
            const ready = createDialogue<NextTurnAnswers>("nextTurn")
            if (ready === "no") break;
            this.printTurnNumber(turnNumber)
            this.playTurn()
            console.log('\n')
            if (this.players.length <= 1) break;
        }
    }

    private playTurn () {
        const startingPlayer = this.players[this.startingPlayer]
        const chosenFeature = this.chooseFeature(startingPlayer)
        this.findWinner(this.players, chosenFeature)
        this.incrementStartingPlayer()
    }

    private printTurnNumber(turnNumber: number) {
        console.log(`\n------------\nTURN NUMBER ${turnNumber}\n------------`)
    }

    private printLeaderboard() {
        console.log('LEADERBOARD:')
        this.players.forEach(player => {
            console.log(`${player.name}: ${player.getCardAmount()} cards`)
        })
        console.log('\n')
    }

    private selectStartingPlayer() {
        this.startingPlayer = random(0, this.players.length-1)
    }

    private initPlayers() {
        const players = [new Player('Human', 'Human')]
        for (let i = 0; i < this.numberOfPlayers - 1; i++) {
            players.push(new Player('AI', `AI ${i + 1}`))
        }
        this.players = players
    }

    private shuffleCards () {
        this.cards = shuffle(this.cards)
    }

    private incrementStartingPlayer () {
        this.startingPlayer++
        if (this.startingPlayer >= this.players.length) this.startingPlayer = 0
    }

    private determineGameWinner () {
        const sortedPlayers = this.players.sort((a, b) => b.getCardAmount() - a.getCardAmount())
        this.printLeaderboard()
        console.log(`\nThe winner is ${sortedPlayers[0].name}`)
    }

    private dealCards () {
        const numberOfCardsForEachPlayer = Math.floor(this.cards.length / this.players.length)
        // give each player equally divided chunks of the whole deck
        this.players.forEach((player, index) => {
            player.setCards(this.cards.slice(numberOfCardsForEachPlayer*index, numberOfCardsForEachPlayer*(index+1)))
        })
    }

    private chooseFeature(player: IPlayer): ChooseFeatureAnswers {
        const { name, type } = player
        const chosenFeature = type === 'Human' ? createDialogue<ChooseFeatureAnswers>('chooseFeature', false) : chooseFeatureAnswers[Math.floor(Math.random()*chooseFeatureAnswers.length)]
        console.log(`\n${name} has chosen to compare ${chosenFeature}!\n`)
        return chosenFeature
    }

    private findWinner(players: IPlayer[], chosenFeature: ChooseFeatureAnswers, cardsToCollectPrevious: Card[] = []): IPlayer {
       const [highestValuePlayers, playedCards] = this.playCardsAndFindHighestValuePlayers(players, chosenFeature)
       const cardsToCollect = [...cardsToCollectPrevious, ...playedCards]
       if (highestValuePlayers.length > 1) {
        console.log('\nWe have a tiebreaker!!!!\n')
        return this.findWinner(highestValuePlayers, chosenFeature, cardsToCollect)
       }
       const winner = highestValuePlayers[0]
       this.collectCards(winner, cardsToCollect)
       return winner
    }

    private playCardsAndFindHighestValuePlayers(players: IPlayer[], chosenFeature: ChooseFeatureAnswers): [IPlayer[], Card[]] {
        const cardsToCollect: Card[] = []
        players.forEach(player => {
            console.log(`${player.name}'s card has a ${chosenFeature} value of ${player.getTopCard()?.[chosenFeature]}`)
            cardsToCollect.push(player.removeTopCard())
        })
        const playersWithoutCards = players.filter(playersWithoutCardsFilter)
        if (playersWithoutCards.length) {
            console.log(`\nThe following player(s) have reached 0 cards. They have been eliminated: ${playersWithoutCards.map(({ name }) => name).join(', ')}`)
        }
        this.players = this.players.filter(playersWithCardsFilter)
        const filteredPlayers = players.filter(playersWithCardsFilter)
        const sortedPlayers = [...filteredPlayers].sort((a, b) => b.getTopCard()?.[chosenFeature] - a.getTopCard()?.[chosenFeature])
        return [
            sortedPlayers.filter(player => player.getTopCard()[chosenFeature] === sortedPlayers[0].getTopCard()[chosenFeature]),
            cardsToCollect
        ]
    }

    private collectCards(winner: IPlayer, cardsToCollect: Card[]) {
        console.log(`\nThe winner of this round is: ${winner.name}`)
        winner.addCardsToBottom(cardsToCollect)
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