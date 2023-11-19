import { addCard } from "./cards/cards";
import createDialogue, { GameStartAnswers } from "./dialogue/dialogue";
import { gameSetup } from "./game/game";

while(true) {
    const scenario = createDialogue<GameStartAnswers>("gameStart").toLowerCase()
    
    if (scenario === 'add a new card') {
        addCard()
    }
    if (scenario === 'play a game') {
        gameSetup()
    }
    if (scenario === 'exit') {
        break;
    }
}


