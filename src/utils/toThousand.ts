function fomaterToThousand(num: number): string {
  if (isNaN(num)) {
    throw new Error('必须传入一个数字！')
  }
  const [intPart, decPart] = num.toString().split('.')
  let fomater: string = ''
  for (let i = intPart!.length - 1; i >= 0; i--) {
    fomater = intPart![i] + fomater
    if ((intPart!.length - i) % 3 === 0 && i) fomater = ',' + fomater
  }

  return decPart ? `${fomater} + '.' + ${decPart}` : fomater
}

export { fomaterToThousand }
