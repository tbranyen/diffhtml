const { keys } = Object;

module.exports = function flattenPages(pages = {}) {
  const flatten = [];

  keys(pages).forEach(name => {
    const [ page, subpages ] = pages[name];

    flatten.push({ type: 'page', href: page, name });

    if (subpages) {
      keys(subpages).forEach(name => {
        const hash = subpages[name];
        let href = `${page}${hash}`;
        let target;

        if (hash.indexOf('http') === 0) {
          href = hash;
          target = 'blank';
        }

        flatten.push({
          type: 'subpage',
          href,
          name,
          target,
        });
      });
    }
  });

  return flatten;
};
