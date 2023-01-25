export const isInteger = (num: number) => {
  const integer = Number(Math.ceil(num));
  const differenceWithInteger = Number(num.toFixed(2)) - integer;
  return differenceWithInteger === 0;
};