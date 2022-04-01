#!/bin/zsh

# Always set current dir to where release script is located (root).
cd "${0%/*}"

OLD_BETA=26
NEW_BETA=27

OLD_VERSION="1.0.0-beta.$OLD_BETA"
NEW_VERSION="1.0.0-beta.$NEW_BETA"

# Ensure that all packages are bootstrapped and the build works before
# continuing a release.
lerna bootstrap
npm run build

# Update all README.md files.
sed -i -e "s/$OLD_VERSION/$NEW_VERSION/g" **/README.md

# Update all JavaScript files.
sed -i -e "s/$OLD_VERSION/$NEW_VERSION/g" **/lib/*.js

# Update the root package version.
sed -i -e "s/$OLD_VERSION/$NEW_VERSION/g" ./package.json

# Update the DevTools version. It cannot use letters or dashes. We will continually
# increment this version as it has no bearing on any kind of semantics. We haven't
# published this yet, so this version isn't really meaningful.
sed -i -e "s/1.0.0.$OLD_BETA/1.0.0.$NEW_BETA/g" ./packages/diffhtml-devtools/chrome-extension/manifest.json

# Make a descriptive commit.
git commit -am"Update JavaScript and REAMDE files to $NEW_VERSION."

npm test

lerna publish

# Update the root package version.
sed -i -e "s/$OLD_VERSION/$NEW_VERSION/g" ./packages/*/package.json

lerna run generate

git commit -am"Update website to $NEW_VERSION"
git push
