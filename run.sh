#!/bin/bash

# Try to open index.html with the default browser
# xdg-open is common on Linux
# open is common on macOS
if command -v xdg-open > /dev/null; then
  xdg-open index.html
elif command -v open > /dev/null; then
  open index.html
else
  echo "Could not find xdg-open or open. Please open index.html in your web browser manually."
  exit 1
fi

exit 0
