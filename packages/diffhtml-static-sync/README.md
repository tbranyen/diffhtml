diffHTML Static Sync
--------------------

Stable Version: 1.0.0-beta.4

A static HTML server that monitors the folder it was executed in for changes
and diffs them seamlessly into the browser without needing to reload the page.

Takes a "just works" approach by automatically injecting the synchronization
code.

##### Installation

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

##### Usage

If all goes well, you should now have a `diffhtml-static-sync` command in your
`PATH` which means you can execute it in the command line. Open an existing
folder with HTML files or make a new one and run this command in it. You
shouldn't see any output just yet, but the command should appear to hang.

Once you open your browser to: http://localhost:8000/ you should see the
`index.html` file or a directory listing to chose from.
