# <±/> diffHTML Website

*Source for https://www.diffhtml.org*

This is the source for the [www.diffhtml.org](https://www.diffhtml.org)
website. It is built using stateless components found in the
[./components](./components) folder. These components control the page markup
and navigation. This skips the need for a template engine and instead leverages
native JavaScript semantics. The layout gets passed values from the
[./config.json](./config.json) file, this controls things like which pages get
built and specifying the navigation layout. Content markup is sourced and
parsed as markdown from the [./pages](./pages) folder. Each page is written to
[../../docs](../../docs) to be picked up by GitHub Pages.

## Commands 

**Start server (and watch for changes):**

This uses [diffhtml-static-sync](../diffhtml-static-sync) under-the-hood to
automatically diff and apply changes providing a very HMR-like experience with
instant updates.

``` sh
npm start
```

**Re-build:**

This uses [diffhtml-render-to-string](../diffhtml-render-to-string)
under-the-hood to render the pages as HTML strings which are then written to
files.

``` sh
npm run build
```

## Updating a page

To update a page, look in the [./content](./content) folder for markdown files
and update there. If you created a brand new page you will need to create a
markdown file to start customizing the content.

## Modifying the navigation

To modify the navigation tree (adding, removing, updating a page) look at the
[./config.json](./config.json) file. This will contain the entries for each
page and sub-page. Don't forget to rebuild after updating.
