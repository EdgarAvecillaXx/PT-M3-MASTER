function* fizzBuzzGenerator(max) {
  // Tu código acá:
  let counter = 1;
  while (counter <= max || !max) {
    if (counter % 3 === 0 && counter % 5 === 0) {
      yield 'Fizz Buzz';
    } else if (counter % 3 === 0) {
      yield 'Fizz';
    } else if (counter % 5 === 0) {
      yield 'Buzz';
    } else {
      yield counter;
    }
    counter++;
  }
  return;
}

module.exports = fizzBuzzGenerator;
