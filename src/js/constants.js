'use strict';

let Party = {
   BLOC: 'BLOC',
   CONSERVATIVE: 'CONSERVATIVE',
   GREEN: 'GREEN',
   LIBERAL: 'LIBERAL',
   NDP: 'NDP'
};

let TOP_RANK_DISTRIBUTION = {
   [Party.BLOC]: 0.06,
   [Party.CONSERVATIVE]: 0.31,
   [Party.GREEN]: 0.05,
   [Party.LIBERAL]: 0.39,
   [Party.NDP]: 0.19
};

let NEXT_RANK_DISTRIBUTION = {
   [Party.BLOC]: [
      {party: Party.CONSERVATIVE, probability: 0.13},
      {party: Party.GREEN, probability: 0.07},
      {party: Party.LIBERAL, probability: 0.16},
      {party: Party.NDP, probability: 0.49}
   ],
   [Party.CONSERVATIVE]: [
      {party: Party.BLOC, probability: 0.02},
      {party: Party.GREEN, probability: 0.08},
      {party: Party.LIBERAL, probability: 0.31},
      {party: Party.NDP, probability: 0.12}
   ],
   [Party.GREEN]: [
      {party: Party.BLOC, probability: 0.04},
      {party: Party.CONSERVATIVE, probability: 0.10},
      {party: Party.LIBERAL, probability: 0.28},
      {party: Party.NDP, probability: 0.43}
   ],
   [Party.LIBERAL]: [
      {party: Party.BLOC, probability: 0.02},
      {party: Party.CONSERVATIVE, probability: 0.21},
      {party: Party.GREEN, probability: 0.11},
      {party: Party.NDP, probability: 0.49}
   ],
   [Party.NDP]: [
      {party: Party.BLOC, probability: 0.08},
      {party: Party.CONSERVATIVE, probability: 0.10},
      {party: Party.GREEN, probability: 0.17},
      {party: Party.LIBERAL, probability: 0.55}
   ]
};
