"use strict";importScripts("../bower_components/babel-polyfill/browser-polyfill.js"),importScripts("instant-runoff.js"),onmessage=function(t){for(var e=generateVotes(t.data.totalVotes,t.data.nextRankDistribution),a=new InstantRunoffElection(e),n=a.leader();!a.hasWinner();)a.advanceRound();postMessage({districtName:t.data.districtName,winner:a.leader(),plurality:n})};
//# sourceMappingURL=election-worker.js.map
