'use strict';

importScripts('../bower_components/babel-polyfill/browser-polyfill.js')
importScripts('instant-runoff.js');

onmessage = function(event) {
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
