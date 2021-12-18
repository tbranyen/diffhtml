# CONTRIBUTING.md

## How to Make a Release (Modern)

Edit the top level variables related to the versions to publish in `release.sh`.

Then run the following command:

``` sh
./release.sh
```

## How to Make a Release (Legacy)

While Lerna takes care of most of the hardwork, we'll want to still make sure
to follow a series of instructions to cut a release. 

### Bump the READMEs and JavaScript files

Ensure all READMes and JavaScript files are updated to the new version using
`sed`. Make a commit after changing them.

For example changing from `1.0.0-beta.8` to `1.0.0-beta.9`:

``` sh
# Update all README.md files.
sed -i -e 's/1.0.0-beta.8/1.0.0-beta.9/g' **/README.md

# Update all JavaScript files.
sed -i -e 's/1.0.0-beta.8/1.0.0-beta.9/g' **/lib/*.js

# Update the root package version.
sed -i -e 's/1.0.0-beta.8/1.0.0-beta.9/g' ./package.json

# Update the DevTools version. It cannot use letters or dashes.
sed -i -e 's/1.0.0.8/1.0.0.9/g' ./packages/diffhtml-devtools/chrome-extension/manifest.json

# Make a descriptive commit.
git commit -am"Update JavaScript and REAMDE files to 1.0.0-beta.9"
```

### Build and test!

Before doing any more release commands, ensure you're in master and it builds
and tests cleanly from the root directory.

``` sh
npm run build
npm test
```

Note this may generate new files, if so, commit these as a dist build.

### Lerna publish

Run the `lerna publish` command and follow the instructions to tag your
release.  This will create the tags and push and do everything else, including
actually publishing to npm, which is great!

``` sh
lerna publish
```

Enter in your new version (using custom), unless you see it listed.

This will automatically crawl nested `package.json` files and update diffhtml
dependencies to the latest version.

### Ensure all dependencies are updated

Lerna often misses updating references to packages. By running this you ensure
all packages reference the latest version.

```sh
# Update the root package version.
sed -i -e 's/1.0.0-beta.8/1.0.0-beta.9/g' ./packages/*/package.json
```

### Update website

The website pulls version information from the package.json files. The version
gets bumped from the previous command. Now you need to run:

```sh
lerna run generate
```

To get the latest docs files built. Commit and push these:

```sh
git commit -am"Update website to 1.0.0-beta.9"
git push
```

### Take a bow

You've earned it.
