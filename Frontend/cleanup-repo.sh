#!/bin/sh
# Script to optimize git repository

echo "🔍 Checking git status..."
git status

echo "\n🧹 Cleaning up git repository..."
# Remove files from git history that are now in .gitignore
git rm -r --cached .
git add .
git status

echo "\n✅ Repository cleaned. You can now commit with:"
echo "git commit -m \"Fixed gitignore and cleaned repository\""
echo "git push"
