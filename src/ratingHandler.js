class ELOSystem {
    k = 32;
    scaleFactor = 400;
    players = [];

    constructor(k, scaleFactor) {
        if (k) this.k = k;
        if (scaleFactor) this.scaleFactor = scaleFactor;
    }

    getRating = function(playerId) {
        return this.players.find(x => x.id == playerId).rating;
    }
    setRating = function(playerId, newRating) {

        for(let i = 0; i < this.players.length; i++) {
            if (this.players[i].id == playerId) {
                this.players[i].rating = newRating;
            }
        }

    }

    runMatch = function(player1, player2, winnerId) {
        //Initialize player 1 if not already in player list
        if (this.players.find(x => x.id == player1.id) == undefined) {
            this.players.push({
                name: player1.name,
                id: player1.id,
                rating: 1000
            })
        }

        //Initialize loser if not already in player list
        if (this.players.find(x => x.id == player2.id) == undefined) {
            this.players.push({
                name: player2.name,
                id: player2.id,
                rating: 1000
            })
        }

        let player1Rating = this.getRating(player1.id);
        let player2Rating = this.getRating(player2.id);

        let player1ExpectedScore = (1.0 / (1.0 + Math.pow(10, ((player2Rating-player1Rating) / this.scaleFactor))));
        let player2ExpectedScore = (1.0 / (1.0 + Math.pow(10, ((player1Rating-player2Rating) / this.scaleFactor))));

        let newPlayer1Rating;
        let newPlayer2Rating;

        if (player1.id == winnerId) {
            //player1 win

            newPlayer1Rating = player1Rating + this.k * (1 - player1ExpectedScore);
            newPlayer2Rating = player2Rating + this.k * (0 - player2ExpectedScore);

        } else {
            //player2 win

            newPlayer1Rating = player1Rating + this.k * (1 - player1ExpectedScore);
            newPlayer2Rating = player2Rating + this.k * (0 - player2ExpectedScore);

        }

        this.setRating(player1.id, newPlayer1Rating);
        this.setRating(player2.id, newPlayer2Rating);

    }

    printLeaderboard = function() {
        let sortedPlayers = this.players.sort((a, b) => {
            return b.rating - a.rating;
        })

        let toReturn = '';

        let longestRanking = (sortedPlayers.length + '').length;
        let longestName = 1;
        for (let player of this.players) {
            if (player.name.length > longestName) {
                longestName = player.name.length;
            }
        }

        for (let i = 0; i < sortedPlayers.length; i++) {

            let ranking = '' + (i+1);
            for (let j = ranking.length; j < longestRanking; j++) {
                ranking += ' ';
            }

            let name = sortedPlayers[i].name;
            for (let j = name.length; j < longestName; j++) {
                name += ' ';
            }

            let rating = Math.round(sortedPlayers[i].rating);

            toReturn += `${ranking} | ${name} | ${rating}\n`;

        }

        return toReturn;

    }

}