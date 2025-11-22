const sumOfSquares = (limit: number): number => {
  let sum = 0;
  for (let i = 1; i <= limit; i++) {
    sum += i * i;
  }

  return sum;
};

export default sumOfSquares;
