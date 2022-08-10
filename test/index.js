// See Stars Test Script for 0.0.1

import test from 'ava';

import { seeStars } from '../src/seeStars.js';


console.log('BEGIN TESTS')

test.todo("Testing seeStars\n")

let color = ['rgba(0,0,0,0)','#123456cc','cadetblue','rgb(170.0,187.0,205.0,0.7)', 0x808080,'hsl(112,22.8%,66.5%,0.8)','123,','DEF'];
    

let starResult = [0,21.042472421009528,61.15383339838567,75.13545630186718,53.58501345216902,73.26251612173222,51.6182187032572,93.3377184761611, ];


for (let eye = 1; eye < 8; eye++) {

  test('L* for ' + color[eye] , (t) => {
      t.deepEqual(starResult[eye], seeStars(color[eye]));
  });
}


