# <±/> diffHTML Static Sync

*Static server that livereloads using VDOM on the entire page along with CSS.*

Stable Version: 1.0.0-beta.30

Provides a static HTTP server that monitors the folder it was executed in for
changes. Whenever a file changes, it is read from disk and sent to the page
using WebSockets. This server injects a client-side handler which responds to
this WebSocket event, and using diffHTML, diffs the contents seamlessly without
needing to reload. This includes all `<HTML>`, `<HEAD>`, and `<BODY>` tag
changes. Provides smart CSS reloading, that instantly updates.

Takes a "just works" approach by automatically injecting the synchronization
code.

## Installation

You can install via `yarn` or `npm`, below you will see commands to install
globally which is what is most commonly used for command line tools.

With npm:

``` sh
npm install -g diffhtml-static-sync
```

With yarn:

```
yarn global add diffhtml-static-sync
```

## Usage

If all goes well, you should now have a `diffhtml-static-sync` command in your
`PATH` which means you can execute it in the command line. Open an existing
folder with HTML files or make a new one and run this command in it. You
shouldn't see any output just yet, but the command should appear to hang.

Once you open your browser to: http://localhost:8000/ you should see the
`index.html` file or a directory listing to chose from.

Basic usage:

``` sh
λ diffhtml-static-sync .
Open http://localhost:8000

Waiting for changes ⣻ Socket connection established
```

Pass `--quiet` to prevent verbose logging in the browser console and terminal.

## Markdown

Markdown is supported out-of-the-box, browse them as you would normal HTML
files. Name your markdown files with `index.markdown` or `index.md` to be
picked up automatically in folders.

## LiveReload

By default any other file types are treated as a full page reload.

## Static Handler

You can define your own handlers to respond to file changes. These are set up
as a global `Set`. Like so:

``` js
window.staticSyncHandlers = new Set();
```

You can add your own function hooks into the Set, but calling `add`:

``` js
staticSyncHandlers.add(({ file, markup /*, quiet */ }) => {
  if (file === 'some/file') {
    // Do something with the contents
  }
});
```

There is an optional argument quiet, shown above, that you can use to silence
logging output to prevent clutter in the console. This is toggled from the
`--quiet` CLI flag.
