"use strict";

const fs = require('fs');

let cities = [];
//order to go through cities
let order = [];
let populationSize = 100;
let population = [];
let fitness = [];
let recordDistance = Infinity;
let bestEver = 0;
let currentBest;


/* ------------- Setting up the best order -------------*/

function City(id, x, y) {
    this.id = parseInt(id, 10);
    this.x = parseInt(x, 10);
    this.y = parseInt(y, 10);
}

let setup = () => {
    //let result = fs.readFileSync('./berlin52(1).tsp.txt').toString().split(/\r\n|\n/);

    let result = fs.readFileSync('./berlin52.tsp.txt').toString().split(/\r\n|\n/);

    result.forEach(element => {
        cities = [...cities, new City(...element.split(" "))];
    });

    order = cities.map(city => city.id - 1);

    for (let i = 0; i < populationSize; i++) {
        population[i] = order.slice();
        shuffle(population[i], 10);
    }

    //Calculating the best random order
    for (let i = 0; i < population.length - 1; i++) {
        let distance = calculateDistance(cities, population[i]);
        if (distance < recordDistance) {
            recordDistance = distance;
            bestEver = population[i];
        }
        fitness[i] = distance;
    }

}

let shuffle = (arr, num) => {
    let aux = arr.length;
    for (let i = 0; i < num; i++) {
        let a = Math.floor(Math.random(arr.length) * aux);
        let b = Math.floor(Math.random(arr.length) * aux);
        swap(arr, a, b);
    }
}

let swap = (arr, i, j) => {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

let calculateDistance = (points, order) => {
    let sum = 0;
    for (let i = 0; i < order.length-1; i++) {
        let aIndex = order[i];
        let cityA = points[aIndex];
        let bIndex = order[i + 1];
        let cityB = points[bIndex];

        let a = cityA.x - cityB.x;
        let b = cityA.y - cityB.y;
        let distance = Math.hypot(cityA.x - cityB.x, cityA.y - cityB.y);
        sum += distance;
    }
    return sum;
}

/* ------------- End of setup the best order -------------*/


/* -------------- GA ------------- */
let calculateFitness = () => {
    let currentRecord = Infinity;
    for (let i = 0; i < population.length; i++) {
        let distance = calculateDistance(cities, population[i]);
        if (distance < recordDistance) {
            recordDistance = distance;
            bestEver = population[i];
        }
        fitness[i] = 1 / (Math.pow(distance, 8) + 1);
    }
}

let normalizeFitness = () => {
    let sum = 0;
    for (let i = 0; i < fitness.length; i++) {
        sum += fitness[i];
    }
    for (let i = 0; i < fitness.length; i++) {
        fitness[i] = fitness[i] / sum;
    }
}

// grants that the next population has as many elements as the previous one
let nextGeneration = () => {
    let newPopulation = [];
    for (let i = 0; i < population.length; i++) {
      let orderA = pick(population, fitness);
      let orderB = pick(population, fitness);
      let order = crossOver(orderA, orderB);
      mutate(order, 0.01);
      newPopulation[i] = order;
    }
    population = newPopulation;
  
  }

//Picks up higher fitness
let pick = (list, prob) => {
    let index = 0;
    let r = Math.random(1);

    while (r > 0) {
        r = r - prob[index];
        index++;
    }
    index--;
    return list[index].slice();
}

let crossOver = (orderA, orderB) =>  {
    let start = Math.floor(Math.random(orderA.length));
    let end = Math.floor(Math.random(start + 1, orderA.length));
    let neworder = orderA.slice(start, end);
    for (let i = 0; i < orderB.length; i++) {
      let city = orderB[i];
      if (!neworder.includes(city)) {
        neworder.push(city);
      }
    }
    return neworder;
  }

let mutate = (order, mutationRate) => {
    for (let i = 0; i < cities.length; i++) {
        if (Math.random(1) < mutationRate) {
            let indexA = Math.floor(Math.random(order.length));
            let indexB = (indexA + 1) % cities.length;
            swap(order, indexA, indexB);
        }
    }
}

setup();
calculateFitness();
normalizeFitness();
nextGeneration();

console.log(recordDistance);






