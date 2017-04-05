// Neuron Object
// --------------

const utils = require('../utils/utils');


class Neuron {

	constructor () {

		// Weights array
		this.weights = [];

		this.bias = 1;

		// Variables for back-propagation.
		this.input = [];
		this.output = 0;
		this.deltas = [];
		this.previousDeltas = [];
		this.gradient = 0;
		this.momentum = 0.7;

	}


	parse (input) {

		let sum = 0;

		// Cycle through each input and multiply it by a weight value.
		// @math : bias + sigma(input * weight)
		for(let i = 0, len = input.length; i < len; i++) {
			// If the neuron has no weight, then create a new random weight.
			if(!this.weights[i]) {
				this.weights[i] = utils.getRandom(-1, 1);
			}
			//Sum the weights
			sum += input[i] * this.weights[i];
		}

		//Add the bias.
		sum += this.bias;

		//the new input of the neuron is the input we just calculated
		this.input = sum;

		//Sigmoid activation function.
		return this.output = utils.getSigmoid(sum);

	}

}

module.exports = Neuron;