import { calculateEnergyRating, validateAndCreateCard, validateCapacity, validateEnergyRating } from "./cards.transformer"

console.log = jest.fn()

describe("cards transformer", () => {
    it('should correctly validate energy rating', () => {
        expect(validateEnergyRating('+++')).toBe(false)
        expect(validateEnergyRating('Hello')).toBe(false)
        expect(validateEnergyRating('17')).toBe(false)
        expect(validateEnergyRating('E++++')).toBe(false)
        expect(validateEnergyRating('A')).toBe(true)
        expect(validateEnergyRating('D+++')).toBe(true)
    })

    it('should correctly calculate energy rating', () => {
        expect(calculateEnergyRating('E++++')).toBe(0)
        expect(calculateEnergyRating('F++')).toBe(2)
        expect(calculateEnergyRating('A+++')).toBe(23)
    })

    it('should correctly validate capacity', () => {
        expect(validateCapacity('8.5')).toBe(true)
        expect(validateCapacity('65.76')).toBe(true)
        expect(validateCapacity('5')).toBe(false)
        expect(validateCapacity('F')).toBe(false)
    })

    it('should correctly transform raw input to card', () => {
        const name = 'name'
        const brand = 'brand'
        const validRPM = '1100'
        const validEnergyRating = 'A+++'
        const validFastestProgram = '30'
        const validCapacity = '8.5'
        const invalidRPM = 'F'
        const invalidEnergyRating = 'D++++'
        const invalidFastestProgram = 'Hello'
        const invalidCapacity = 'Invalid Capacity'

        const invalidCard1 = validateAndCreateCard(name, brand, invalidRPM, validEnergyRating, validFastestProgram, validCapacity)
        expect(invalidCard1).toBeNull()
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Invalid RPM'))

        const invalidCard2 = validateAndCreateCard(name, brand, validRPM, invalidEnergyRating, validFastestProgram, validCapacity)
        expect(invalidCard2).toBeNull()
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Invalid energy rating'))

        const invalidCard3 = validateAndCreateCard(name, brand, validRPM, validEnergyRating, invalidFastestProgram, validCapacity)
        expect(invalidCard3).toBeNull()
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Invalid fastest program'))

        const invalidCard4 = validateAndCreateCard(name, brand, validRPM, validEnergyRating, validFastestProgram, invalidCapacity)
        expect(invalidCard4).toBeNull()
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Invalid capacity'))

        const validCard = validateAndCreateCard(name, brand, validRPM, validEnergyRating, validFastestProgram, validCapacity)
        expect(validCard).not.toBeNull()
    })


})