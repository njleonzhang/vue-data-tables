#!/usr/bin/env bash

set -e

if [[ -z $1 ]]; then
  echo "Enter new version: "
  read VERSION
else
  VERSION=$1
fi

read -p "Releasing $VERSION - are you sure? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Releasing $VERSION ..."

  # lint
  npm run lint

  # build
  VERSION=$VERSION npm run build

  # revise version in doc
  echo "revising version in doc..."
  sed -i '' "s/vue-data-tables@\(.*\)\/dist/vue-data-tables@$VERSION\/dist/g" docs/index.html
  sed -i '' "s/<small>\(.*\)<\/small>/<small>$VERSION<\/small>/" docs/_coverpage.md
  sed -i '' "s/<small>\(.*\)<\/small>/<small>$VERSION<\/small>/" docs/en-us/_coverpage.md
  sed -i '' "s/<small>\(.*\)<\/small>/<small>$VERSION<\/small>/" docs/zh-cn/_coverpage.md

  # commit
  git add docs
  git commit -m "build: build $VERSION"
  npm version $VERSION --message "build: release $VERSION"

  # push
  git push origin refs/tags/v$VERSION
  git push

fi
