# CONTRIBUTING.md

## How to Make a Release

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

# Make a descriptive commit.
git commit -m"Update JavaScript and REAMDE files to 1.0.0-beta.9"
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
release.  This will create the tags and push and do everything else, sans
actually publish.

``` sh
lerna publish
```

Enter in your new version, unless you see it listed.

### Publish to npm

Simply run:

``` sh
npm publish
```

### Take a deep breath

You've earned it.
