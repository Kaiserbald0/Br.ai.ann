// Population Object
// --------------
//get a random number between min and max

const utils = require("../utils/utils");
const Genome = require("./Genome");

class Population {

	constructor (howMany,noImprovementsThreshold,fitnessFunction) {

		//population of the first generation
		if ( ! howMany ) howMany = 20;
		this.size = howMany;

		//stop evolving after this number of generation
		//if there are no improvement on the top fitness
		//exactly I dont care about the average population
		//we do care only about the fittest dude around
		if ( ! noImprovementsThreshold ) noImprovementsThreshold = 50;
		this.noImprovementsThreshold = noImprovementsThreshold;

		//arrays of dudes
		this.Dudes = [];

		//how spartan are we?
		//it's a % of dudes that survives the cut
		//1 = kill'em all
		//0 = save all of them
		this.elitism = 0.5;


		//Generation number, mainly for tracking purpose
		this.generation = 0;
		//Number of generation since last improvement
		this.noImprovement = 0;
		//The most fit of the previous generation
		//this dude is frekin Leonida
		this.lastScore = false;

		//storing the fitness function
		this.fitnessFunction = fitnessFunction;

		//they are coming to steal out jobs!
		this.fill();
		//console.log("After 1st filling", JSON.stringify(this.Dudes[0].decodeGenome()));


	}

	//filling missing dudes with random people, like immigrants
	//to keep the population at a constant level #brexit
	fill () {

		//console.log("Filling up",this.size,this.Dudes.length);
		while (this.Dudes.length < this.size) {
			let freshGenome = new Genome(this.fitnessFunction,null);
			//console.log("freshGenome", JSON.stringify(freshGenome.genome));
			this.Dudes.push(freshGenome);
		}
		//console.log("Filling up",this.size,this.Dudes.length);

	}

	//we need to sort these guys, you don't want to kill the
	//fittest
	sort () {

		this.Dudes.sort((a, b) => {
			return b.amIToughEnough(this.fitnessFunction) - a.amIToughEnough(this.fitnessFunction);
		});

	};

	//just giving mother nature little hand
	//#darwinAtHisBest
	kill () {

		let target = Math.floor( (1 - this.elitism) * this.Dudes.length );
		while (this.Dudes.length > target)
		{
			this.Dudes.pop();
		}

	};

	//sweet sweet love
	mate () {

		//Creating mating list the rule will be that
		//the fittest will mate with a random then removed from
		//the list, 1 mating a generation allowed,
		//the mating list is an array of index of the Dudes ready to
		//make sweet sweet love
		let matingList = [],
			//not being sexist but it is easier to remember
			//btw the fittest is always the guy #noSexism
				theGuy,theGirl,
			//to complete the happiest family
				theKiddosGenome,theSistasGenome;

		for (let idx=0; idx<this.Dudes.length; idx++) {
			matingList.push(idx);
		}

		//console.log(matingList);

		while (matingList.length && this.Dudes.length < this.size-2 ) {

			//getting the fittest
			theGuy = matingList.shift();
			//getting a random partner
			theGirl = matingList.splice(utils.getRandom(0,matingList.length-1),1)[0];

			//console.log("The Dudes are making sweet sweet lova lova", theGuy, theGirl);

			//here is the result of the mating,
			//two new fresh genomes
			[theKiddosGenome, theSistasGenome] = this.Dudes[theGuy].mateWith(this.Dudes[theGirl].genome);

			//adding the genome to the population
			this.Dudes.push(new Genome(this.fitnessFunction, theKiddosGenome));
			this.Dudes.push(new Genome(this.fitnessFunction, theSistasGenome));

		}

	}

	//and the survivors live another day
	liveAnotherDay() {
		//console.log("Before sort", JSON.stringify(this.Dudes[0].decodeGenome()));
		this.sort();
		//console.log("After sort", JSON.stringify(this.Dudes[0].decodeGenome()));
		this.kill();
		//console.log("After kill", JSON.stringify(this.Dudes[0].decodeGenome()));
		this.mate();
		//console.log("After mate", JSON.stringify(this.Dudes[0].decodeGenome()));
		this.fill();
		//console.log("After fill", JSON.stringify(this.Dudes[0].decodeGenome()));
		this.sort();
	}

	//display some infos
	displayInfos () {

		let layer_distribution = {};

		this.Dudes.forEach(MrDude => {
			if (typeof layer_distribution[MrDude.genome.length] === 'undefined') layer_distribution[MrDude.genome.length] = 0;
			layer_distribution[MrDude.genome.length]++;
		});

		console.log(
			"Generation", this.generation, "(" , this.noImprovement, ")",
			"Best score", this.Dudes[0].amIToughEnough(this.fitnessFunction),
			"Genomes", layer_distribution
		);

		if (this.noImprovement === this.noImprovementsThreshold) {
			console.log(JSON.stringify(this.Dudes[0].decodeGenome(this.fitnessFunction)));
		}


	}

	//main population loop
	evolve () {

		//too many generation without improvements,
		//we reached the best
		if (this.noImprovement < this.noImprovementsThreshold)
		{

			//saving the best score of the current generation
			this.lastScore = this.Dudes[0].amIToughEnough(this.fitnessFunction);

			//live another day
			this.liveAnotherDay();

			//check if the score of the new generation improved
			//if not this generation didn't improve and we increment the counter
			if (this.lastScore >= this.Dudes[0].amIToughEnough(this.fitnessFunction)) {
				this.noImprovement++;
			} else {
				this.noImprovement = 0;
			}

			this.generation++;

			//the timeout is not to flood the stdout
			setTimeout(() => {
				this.evolve()
			}, 1);

			this.displayInfos();

		}

	};


}

module.exports = Population;