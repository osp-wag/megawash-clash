import fs from 'fs'
import readlineSync from 'readline-sync'
import createDialogue, { NextCardAnswers } from '../dialogue/dialogue'
import { validateAndCreateCard } from './cards.transformer'

export type Card = {
    name: string,
    brand: string,
    rpm: number,
    energyRating: number,
    fastestProgram: number,
    capacity: number
}

const fileUrl = './src/cards/cards.csv'

export const getCards = (): Card[] => {
    try {
        const cardsBuffer = fs.readFileSync(fileUrl)
        const splitData = cardsBuffer.toString().split('\n')
        const slicedData = splitData.slice(1) // needed since the first line is just column names
        
        const validAppliances = slicedData.map(line => {
            const fields = line.split(',')
            return validateAndCreateCard(fields[0], fields[1], fields[2], fields[3], fields[4], fields[5])
        }).filter(item => item !== null)
        return validAppliances as Card[]
    } catch {
        console.log("Could not load cards, please try again later")
    }
}

export const addCard = () => {
    while(true) {
        const nameInput = readlineSync.question('Card name: ')
        const brandInput = readlineSync.question('Card brand: ')
        const rpmInput = readlineSync.question('RPM: ')
        const energyRatingInput = readlineSync.question("Energy rating: ")
        const fastestProgramInput = readlineSync.question("Fastest program: ")
        const capacityInput = readlineSync.question("Capacity: ")
        const card = validateAndCreateCard(nameInput, brandInput, rpmInput, energyRatingInput, fastestProgramInput, capacityInput)
        try {
            if (card === null) {
                throw new Error()
            }
            const { name, brand, rpm, energyRating, fastestProgram, capacity } = card
            fs.appendFileSync(fileUrl, `\n${name}, ${brand}, ${rpm}, ${energyRating}, ${fastestProgram} minutes, ${capacity} kg`);
            console.log("Card inserted successfully")
        } catch {
            console.log("Inserting card failed")
        }
        
        const createNewCard = createDialogue<NextCardAnswers>("nextCard")
        if (createNewCard === 'go back') break;
    }
}


