function match(user1, user2) {
    // lance une partie entre user1 et user2 et retourne le gagnant
}

function tournoi(users, variant) { // a verifier si le nombre de joueur est pair et faire des variantes de tournoi
    let currentRound = users;
    let roundNumber = 1;

    while (currentRound.length > 1) {
        // notif live chat du debut du round
        console.log(`Round ${roundNumber}:`);
        let nextRound = [];

        for (let i = 0; i < currentRound.length; i += 2) {
            const user1 = currentRound[i];
            const user2 = currentRound[i + 1];
            const winner = match(user1, user2);
            // envoyer une notif live chat avec le resultat et anoncer le prochain match
            console.log(`Match: ${user1} vs ${user2} => Winner: ${winner}`);
            nextRound.push(winner);
        }
        currentRound = nextRound;
        roundNumber++;
    }
    // notif live chat du gagnant du tournoi
    console.log(`Tournament Winner: ${currentRound[0]}`);
    return currentRound[0];
}

export { tournoi };