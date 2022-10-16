export function classnames(...names: (string | undefined | Record<string, boolean>)[]) {
  return names
    .reduce<string[]>((pre, cur) => {
      if (typeof cur !== 'object') {
        if (cur) pre.push(cur);
      } else {
        for (const key in cur) {
          if (cur[key]) {
            pre.push(key);
          }
        }
      }
      return pre;
    }, [])
    .join(' ');
}
