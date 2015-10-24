'use strict';

let ctx = document.querySelector('#canvas').getContext('2d');
let chart = new Chart(ctx);

let client = new XMLHttpRequest();
client.open('GET', 'data.json');
client.send();

client.onload = function() {
   let data = JSON.parse(this.response);
   let seats = {};

   for (let districtResult of data) {
      let nextRankDistribution = nextRankDistributionFromDistrictResult(districtResult);
      let votes = generateVotes(districtResult.totalVotes, nextRankDistribution);

      let election = new InstantRunoffElection(votes);
      let initialPlurality = election.leader();
      while (!election.hasWinner()) {
         election.advanceRound();
      }

      let leader = election.leader();
      console.log(`${districtResult.district}: ${initialPlurality} -> ${election.leader()}`);

      if (!seats.hasOwnProperty(leader)) {
         seats[leader] = 0;
      }
      seats[leader]++;
   }
   let labels = [];
   let chartData = [];
   for (let key of Object.keys(seats)) {
      labels.push(key);
      chartData.push(seats[key]);
   }
   chart.Bar({
      labels,
      datasets: [{data: chartData}]
   });
};

function nextRankDistributionFromDistrictResult(districtResult) {
   let nextRankDistribution = {};
   for (let key of Object.keys(NEXT_RANK_DISTRIBUTION)) {
      nextRankDistribution[key] = NEXT_RANK_DISTRIBUTION[key];
   }
   let blankDistribution = [
      {party: Party.BLOC, probability: districtResult.bloc / 100},
      {party: Party.CONSERVATIVE, probability: districtResult.conservative / 100},
      {party: Party.GREEN, probability: districtResult.green / 100},
      {party: Party.LIBERAL, probability: districtResult.liberal / 100},
      {party: Party.NDP, probability: districtResult.ndp / 100}
   ];
   nextRankDistribution['BLANK'] = blankDistribution;

   return nextRankDistribution;
}
