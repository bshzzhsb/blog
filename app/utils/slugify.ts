function slugify(content: string) {
  return (
    'a' +
    content
      .split('')
      .reduce((pre, cur) => {
        pre = (pre << 5) - pre + cur.charCodeAt(0);
        return pre & pre;
      }, 0)
      .toString()
  );
}

export default slugify;
