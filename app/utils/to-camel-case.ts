export function toCamelCase(str: string) {
  let flag = false;
  let res = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '-' || str[i] === '_') {
      flag = true;
    } else {
      res += flag ? str[i].toUpperCase() : str[i];
      flag = false;
    }
  }
  return res;
}

export function objToCamelCase(obj: object) {
  const res: { [key: string]: unknown } = {};
  for (const [key, value] of Object.entries(obj)) {
    res[toCamelCase(key)] = value;
  }
  return res;
}
