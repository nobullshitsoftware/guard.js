#!/usr/bin/env bash

set -euo pipefail

for f in tests/*.js; do
	node "$f"
done
