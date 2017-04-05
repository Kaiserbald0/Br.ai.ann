// The Brain Object
// --------------
const Layer = require("./Layer");
const Neuron = require("./Neuron");


class Brain {

	constructor (snapshot) {

		this.layers = [];
		// Initialize network.
		// check if we have a snapshot
		if (typeof snapshot === 'undefined') {
			//nope, new network
			throw new Error('Cmon, I work only with snapshots');
		} else {
			//yep, time to inject the brain into the network
			this.injectBrain(snapshot);

		}

	}

	injectBrain (snapshot) {

		snapshot.forEach(layer => {

			this.layers.push(new Layer());
			layer.forEach((neuron,neuron_index) => {

				//push the neurons to the latest layer created
				this.layers[this.layers.length - 1].neurons.push(new Neuron());
				this.layers[this.layers.length - 1].neurons[neuron_index].weights = neuron.weights;
				this.layers[this.layers.length - 1].neurons[neuron_index].bias = neuron.bias;

			});

		});

	}

	input (input) {

		let result = JSON.parse(JSON.stringify(input));

		for(let i = 0, len = this.layers.length; i < len; i++) {
			result = this.layers[i].parse(result);
		}

		return result;

	}

	extractTheBrain() {

		let snapshot = [];

		this.layers.forEach((layer,layer_index) => {
			snapshot[layer_index] = [];
			layer.neurons.forEach(n => {

				snapshot[layer_index].push({
					weights : n.weights,
					bias : n.bias
				})

			})
		});

		return snapshot;

	}

}


module.exports = Brain;