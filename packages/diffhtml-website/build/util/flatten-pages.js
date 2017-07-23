const { keys } = Object;

module.exports = function flattenPages(pages = {}) {
  const flatten = [];

  keys(pages).forEach(name => {
    const [ page, subpages ] = pages[name];

    flatten.push({ type: 'page', href: page, name });

    if (subpages) {
      keys(subpages).forEach(name => {
        const hash = subpages[name];

        flatten.push({
          type: 'subpage',
          href: `${page}${hash}`,
          name,
        });
      });
    }
  });

  return flatten;
};
