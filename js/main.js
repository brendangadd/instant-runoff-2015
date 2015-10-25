'use strict';

let numDistricts = 1;
let numElectionsCompleted = 0;
let seats = {};

let electionWorker = new Worker('/js/election-worker.js');

Chart.defaults.global.responsive = true;
Chart.defaults.global.maintainAspectRatio = false;
Chart.defaults.global.scaleOverride = true;
Chart.defaults.global.scaleSteps = 10;
Chart.defaults.global.scaleStepWidth = 25;
Chart.defaults.global.scaleStartValue = 0;
let chartLabels = ['Bloc', 'Conservative', 'Green', 'Liberal', 'NDP'];
let chartColors = ['#09c', '#00e', '#0c0', '#a00', '#f90'];

let fptpChart = simpleBarChart('#chart-fptp', chartLabels, [10, 99, 1, 184, 44]);
colorChart(fptpChart, chartColors);

let irvChart = simpleBarChart('#chart-irv', chartLabels, [0, 0, 0, 0, 0]);
colorChart(irvChart, chartColors);

let dataIndex = {
   [Party.BLOC]: 0,
   [Party.CONSERVATIVE]: 1,
   [Party.GREEN]: 2,
   [Party.LIBERAL]: 3,
   [Party.NDP]: 4
};

let client = new XMLHttpRequest();
document.querySelector('#start').addEventListener('click', function() {
   this.setAttribute('disabled', 'disabled');
   client.open('GET', 'data.json');
   client.send();
   document.body.className = 'state-inelection';
});

client.onload = function() {
   let districtResults = JSON.parse(this.response);
   numDistricts = districtResults.length;

   for (let districtResult of districtResults) {
      let nextRankDistribution = createNextRankDistribution(districtResult);
      electionWorker.postMessage({
         districtName: districtResult.district,
         totalVotes: districtResult.totalVotes,
         nextRankDistribution
      });
   }
};

electionWorker.onmessage = function(event) {
   let winner = event.data.winner;

   if (!seats.hasOwnProperty(winner)) {
      seats[winner] = 0;
   }
   seats[winner]++;

   updateProgress(++numElectionsCompleted / numDistricts);
   updateSeatCounts();
   addResultTableRow(event.data);

   irvChart.datasets[0].bars[dataIndex[event.data.winner]].value++
   irvChart.update();

   console.log(event.data.districtName, event.data.winner);
};

function createNextRankDistribution(districtResult) {
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

function updateProgress(progress) {
   let progressBar = document.querySelector('#progress');
   let percentage = progress * 100;
   let roundedPercentage = Math.round(percentage);
   progressBar.setAttribute('aria-valuenow', roundedPercentage);
   progressBar.style.width = percentage + '%';
   progressBar.textContent = roundedPercentage + '%';
}

function updateSeatCounts() {
   document.querySelector('#seat-count-bloc span').textContent = seats[Party.BLOC] || 0;
   document.querySelector('#seat-count-conservative span').textContent = seats[Party.CONSERVATIVE] || 0;
   document.querySelector('#seat-count-green span').textContent = seats[Party.GREEN] || 0;
   document.querySelector('#seat-count-liberal span').textContent = seats[Party.LIBERAL] || 0;
   document.querySelector('#seat-count-ndp span').textContent = seats[Party.NDP] || 0;
}

function addResultTableRow(electionResult) {
   let tr = document.createElement('tr');
   let tdDistrict = document.createElement('td');
   let tdPlurality = document.createElement('td');
   let tdWinner = document.createElement('td');

   tdDistrict.textContent = electionResult.districtName;
   tdPlurality.textContent = electionResult.plurality;
   tdWinner.textContent = electionResult.winner;

   tr.appendChild(tdDistrict);
   tr.appendChild(tdPlurality);
   tr.appendChild(tdWinner);

   document.querySelector('#result-table tbody').appendChild(tr);
}

function simpleBarChart(selector, labels, data) {
   let ctx = document.querySelector(selector).getContext('2d');
   let chart = new Chart(ctx).Bar({
         labels: labels,
         datasets: [{data}]
      }, {scaleShowVerticalLines: false})
   ;
   return chart;
}

function colorChart(chart, colors) {
   for (let i = 0; i < colors.length; i++) {
      chart.datasets[0].bars[i].fillColor = colors[i];
      chart.datasets[0].bars[i].strokeColor = colors[i];
   }
   chart.update();
}
