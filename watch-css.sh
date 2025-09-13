#!/bin/bash
while true; do
  bunx tailwindcss -i ./src/styles/main.css -o ./public/styles.css --minify
  echo "export const styles = \`$(cat public/styles.css | sed 's/\`/\\\`/g')\`;" > src/styles.ts
  sleep 2
done
