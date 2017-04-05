// Genome Object
// --------------

const Brain = require('../brain/Brain');
const utils = require('../utils/utils');

//percentage of mutation
const _MUTATION_RATE = 5;

//percentage of perturbation
const _MAX_PERTURBATION_RATE = 2;

//percentage of layer mutation
const _MUTATION_LAYER_RATE = 5;
const _MAX_LAYERS = 3;

//each array is a layer, each layer has the neurons and the last weight is the bias
//this is a brain generated with backpropagation, can you do a batter job mother nature?
const theDefaultGenome = [
	[
		[5.15027931382266,5.148688947951809,-1.234788356102831],
		[-3.990454914010234,-3.989954176324832,5.627691711130935]
	],
	[
		[-4.961157827346999,0.40189493185344466,1.5078298699092365],
		[1.3534698819879896,1.7142285910266037,-0.8189803656967147],
		[-2.202371828807682,-0.9902491910591523,1.0118189797331294],
		[-5.617671015306973,1.595044606641634,0.7521576811531848],
		[-2.328978693618989,-2.097859570201634,2.3285911625132965],
		[1.4147613330133701,-8.143160940364098,1.8516824447993816]
	],
	[
		[-5.1402498338182125,5.478580288688524,-2.5587934782073942,-5.547260939714908,-4.499553427961734,-9.68045701236518,2.571316659159859]
	]
];



class Genome {

	//first we need a fitness function,
	//second we might want to reconstruct  genome
	constructor (fitnessFunction, genome) {

		if (genome !== null) {
			this.genome = genome;
		} else {
			this.genome = this.getAGenome();
			//console.log("Random genome",JSON.stringify(this.genome));
		}

		if (fitnessFunction && {}.toString.call(fitnessFunction) === '[object Function]') {
			this.fitnessFunction = fitnessFunction
		} else {
			throw new Error("I need a fitness function mate!")
		}

		this.fitness = 0;
		this.neuralNetwork = this.decodeGenome();

		this.brain = new Brain(this.neuralNetwork);

	}

	getRandomLayer(neurons,synapsis) {

		let layer = [];
		for ( let n=0; n<neurons; n++) {

			let neuron = [];
			for ( let s=0; s<synapsis; s++) {
				neuron.push(utils.getRandomFloat(-11,11));
			}

			layer.push(neuron)

		}

		return layer;

	}

	getAGenome() {

		let IL = this.getRandomLayer(2,3);
		let HL = [this.getRandomLayer(6,3)];
		let OL = this.getRandomLayer(1,7);


		for (let idx = 0; idx < utils.getRandom(0,_MAX_LAYERS); idx ++) {
			HL.push(this.getRandomLayer(6,7));
		}
		//console.log(myGenome);

		return this.reconstructGenome(IL,HL,OL);
	}

	decodeGenome () {

		let NN = [],
		 NN_Layer = [];

		JSON.parse(JSON.stringify(this.genome)).forEach(layer => {

			NN_Layer = [];

			layer.forEach(neuron => {

				let bias = neuron.pop();

				NN_Layer.push({
					"weights":neuron,
					"bias":bias
				})
			});

			NN.push(NN_Layer);

		});

		//console.log("Neural",JSON.stringify(NN));

		return NN;

	}

	reconstructGenome(inputLayer, hiddenLayers, outputLayer) {

		let reconstructedGenome = [];
		reconstructedGenome.push(inputLayer);

		hiddenLayers.forEach(l => {
			reconstructedGenome.push(l)
		});

		reconstructedGenome.push(outputLayer);

		return reconstructedGenome;
	}

	deconstructGenome(genome) {

		//console.log("genome",genome);

		let input = genome[0];
		let output = genome[genome.length - 1];
		let hiddenLayers = genome.filter((l,i) => {
			return (i > 0 && i < genome.length - 1)
		});

		//console.log("input",input);
		//console.log("output",output);
		//console.log("hiddenLayers",hiddenLayers);

		return {
			input: input,
			hiddenLayers: hiddenLayers,
			output: output
		}
	}

	//mating with a second genome
	//this is a genome
	//it returns 2 new genomes
	mateWith(partnersGenome) {

		//console.log("mateWith",JSON.stringify(this.genome));

		let internalGenomeSource = JSON.parse(JSON.stringify(this.genome))
			, externalGenomeSource = JSON.parse(JSON.stringify(partnersGenome))
			, kiddo = []
			, sista = []
			, internalGenome = {}
			, externalGenome = {}
		;

		//let max_pivot = internalGenomeSource.length;
		//if (externalGenomeSource.length < max_pivot) max_pivot = externalGenomeSource.length;

		//splitting the genome in,
		//input layer, output layer and hidden layers
		internalGenome = this.deconstructGenome(internalGenomeSource);
		externalGenome = this.deconstructGenome(externalGenomeSource);

		//console.log("internalGenome",JSON.stringify(internalGenome));
		//console.log("externalGenome",JSON.stringify(externalGenome));

		//swaaaaaaap dude, swaaaaaaaap
		kiddo = this.reconstructGenome(internalGenome.input,externalGenome.hiddenLayers,internalGenome.output);
		sista = this.reconstructGenome(externalGenome.input,internalGenome.hiddenLayers,externalGenome.output);


		//console.log("Genome", JSON.stringify(this.genome));
		//console.log("Sista ", JSON.stringify(sista));

		//kiddo = theDefaultGenome;
		//sista = theDefaultGenome;

		//mutate the genome
		//let's see mother nature what has for us
		kiddo = this.mutate(kiddo);
		sista = this.mutate(sista);

		return [kiddo,sista]

	}

	mutate(genome) {

		//console.log("Mutation");
		//console.log(genome);
		if (_MUTATION_LAYER_RATE > utils.getRandom(0,100)) {


			let tGenome = this.deconstructGenome(genome);

			if (utils.getRandom(-1,1) > 0) {
				//adding layer
				//console.log("adding the layers");
				if (tGenome.hiddenLayers.length < _MAX_LAYERS) {
					tGenome.hiddenLayers.push(this.getRandomLayer(6,7));
				} else {
					tGenome.hiddenLayers.pop();
				}

			} else {
				//subtracting a layer
				//console.log("subtracting the layers");
				if (tGenome.hiddenLayers.length > 1) {
					tGenome.hiddenLayers.pop();
				} else {
					tGenome.hiddenLayers.push(this.getRandomLayer(6,7))
				}

			}

			genome = this.reconstructGenome(tGenome.input,tGenome.hiddenLayers,tGenome.output);

		}

		//foreach layer of the genome
		genome.forEach((layer,idx,theGenome) =>{
			//foreach neurons
			//console.log("layer");
			layer.forEach((neuron,idx2,theLayer)=>{
				//foreach weight
				//console.log("neurons");
				neuron.forEach((weight,idx3,theNeuron)=>{
					//console.log("weight");
					if (_MUTATION_RATE > utils.getRandom(0,100)) {
						//mutation of a weight
						let weightChange = weight / 100 * utils.getRandom(0,_MAX_PERTURBATION_RATE);
						//console.log('weightChange',weightChange);
						if (utils.getRandom(-1,1) > 0) {
							genome[idx][idx2][idx3] -= weightChange;
						} else {
							genome[idx][idx2][idx3] += weightChange;
						}
					}
				})
			})
		});

		//console.log(genome);

		return genome;

	}

	amIToughEnough () { //who knows dude, who knows?

		//the same genome will produce the same output,
		//even if we are talking about machine, expecting
		//different output from different input would be quite mad
		if (this.fitness === 0) {
			//executing the fitness function with the brain
			this.fitness = this.fitnessFunction(this.brain);
		}

		return this.fitness;

	}

}

module.exports = Genome;