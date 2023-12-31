import { Card } from "./cards"

// energy rating is calculated as follows: each letter corresponds to a number of points as defined below, and then for every + in the rating, another point is added
const EnergyRatingMap: Record<string, number> = Object.freeze({
    F: 0,
    E: 4,
    D: 8,
    C: 12,
    B: 16,
    A: 20
})


export const calculateEnergyRating = (energyRating: string): number => {
    if (!validateEnergyRating(energyRating)) {
        console.log("Encountered invalid energy rating")
        return 0
    }
    return EnergyRatingMap[energyRating.replace(/\+/g, '')] + (energyRating.match(/\+/g) ?? []).length
}

export const validateEnergyRating = (energyRating: string): boolean => {
    const energyRatingRegex = /^[A-F][+]{0,3}$/;
    return energyRatingRegex.test(energyRating)
}

export const validateCapacity = (capacity: string): boolean => {
    const capacityRegex = /^\d+(\.\d+)?$/;
    return capacityRegex.test(capacity)
}

export const validateAndCreateCard = (rawName: string, rawBrand: string, rawRPM: string, rawEnergyRating: string, rawFastestProgram: string, rawCapacity: string): Card | null => {
    const name = rawName.trim()
    const brand = rawBrand.trim()
    const rpm = parseInt(rawRPM.trim())
    const energyRating = rawEnergyRating.trim()
    const fastestProgram = parseInt(rawFastestProgram.trim())
    const capacity = parseFloat(rawCapacity.trim())
    
    if (isNaN(rpm)) {
        console.log("Invalid RPM. RPM must be a number.")
        return null
    }
    if (!validateEnergyRating(energyRating)) {
        console.log("Invalid energy rating. Example format: [F-A]+++")
        return null
    }
    if(isNaN(fastestProgram)) {
        console.log("Invalid fastest program. Fastest program must be a number.")
        return null
    }
    if (!validateCapacity(capacity.toString())) {
        console.log("Invalid capacity. Example format: 8.5")
        return null
    }
    
    return {
        name,
        brand,
        rpm,
        energyRating: calculateEnergyRating(energyRating),
        fastestProgram,
        capacity
    }
}