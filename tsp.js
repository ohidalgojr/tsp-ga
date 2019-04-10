"use strict";

require('console.table');
const fs = require('fs');

let cities = [];

function City(id, x, y){
    this.id = id;
    this.x = x;
    this.y = y;
}

let result = fs.readFileSync('./berlin52.tsp.txt').toString().split("\n");

result.forEach(element => {
    cities = [...cities,new City(...element.split(' '))];
});








