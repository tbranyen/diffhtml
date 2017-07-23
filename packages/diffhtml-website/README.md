# <±/> diffHTML Website

*Source for https://www.diffhtml.org*

This is the source for the [www.diffhtml.org](https://www.diffhtml.org)
website. It is built using stateless components found in the
[./components](./components) folder. The markup is generated from the
[config.json](./config.json) file and each page is written to `/public`. Since
components are used the navigation is dynamically generated using JavaScript
and HTML. If a markdown file is present that matches the file name the contents
will be rendered and injected into the page.

## Commands 

Start server:

``` sh
npm start
```

Re-build:

``` sh
npm run build
```

## Updating a page

To update a page, look in the [content](./content) folder for markdown files
and update there. If you created a brand new page you will need to create a
markdown file to start customizing the content.

## Modifying the navigation

To modify the navigation tree (adding, removing, updating a page) look at the
[config.json](./config.json) file. This will contain the entries for each
page and sub-page. Don't forget to rebuild after updating.
