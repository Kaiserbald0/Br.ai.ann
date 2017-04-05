//Some usefull stuff
//get a random number between min and max
const getRandom = (min,max) => {
	return Math.floor(Math.random()*(max-min+1)+min);
};

const getRandomFloat = (min,max) => {
	return Math.floor(Math.random()*(max-min+1)+min);
};

//return the Sigmoid function of something [https://en.wikipedia.org/wiki/Sigmoid_function]
const getSigmoid = (something) => {
	return ( 1 / (1 + Math.exp(-1 * something)) );
};


module.exports = {
	getRandom
	, getRandomFloat
	, getSigmoid
};