// The Layer Object: A layer is just a fancy name for an array of neurons
// ------------
class Layer {

	constructor() {
		//our array of neurons
		this.neurons = [];
	}

	parse (input) {
		//parse all the neurons of the layer and push the result to the next layer
		let result = [];
		// For all neurons, ...
		for(let i = 0, len = this.neurons.length; i < len; i++) {
			//Push a result value to an output array.
			result[i] = this.neurons[i].parse(input);
		}
		return result;

	}

}

module.exports = Layer;
