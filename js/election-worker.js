'use strict';

importScripts('instant-runoff.js');

this.onmessage = function(event) {
   let votes = generateVotes(
      event.data.totalVotes,
      event.data.nextRankDistribution
   );

   let election = new InstantRunoffElection(votes);
   let plurality = election.leader();

   while (!election.hasWinner()) {
      election.advanceRound();
   }

   postMessage({
      districtName: event.data.districtName,
      winner: election.leader(),
      plurality
   });
};
