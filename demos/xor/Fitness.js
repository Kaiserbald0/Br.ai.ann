// Fitness Function
// --------------

const test_cases = [
	{
		input: [0, 0],
		expected: [0]
	},
	{
		input: [0, 1],
		expected: [1]
	},
	{
		input: [1, 0],
		expected: [1]
	},
	{
		input: [1, 1],
		expected: [0]
	},
];


//The brain is passed form the genome
//this is a module so it is fine
//the idea is that you can plug different
//fitness modules

const Fitness = (brain) => {

	//in this case the fitness function return a value from 0->4
	//4 being the perfect result (discrepancy == 0)

	let fitness = 4;

	test_cases.forEach(myCase => {
		//forEach test case the brain is calculating the output
		let result = brain.input(myCase.input);
		//and the discrepancy is subtracted from the fitness
		fitness -= Math.abs(result - myCase.expected[0]);
	});

	//console.log("Final Discrepancy from ideal",fitness);

	return fitness;

};

module.exports = Fitness;