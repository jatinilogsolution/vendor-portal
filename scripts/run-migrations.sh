#!/bin/bash

# Automation script for Database Migration and Consistency Checks
echo "🚀 Starting Database Migration and Consistency Checks..."

# Ensure we are in the project root
cd "$(dirname "$0")/.."

# 1. Run the linking and status harmonization script
echo -e "\n🔍 Phase 1: Harmonizing LR, Annexure, and Invoice links..."
DRY_RUN=false npx tsx scripts/migrate-linking.ts

# 2. Add other scripts here if needed in the future
# echo -e "\n🔍 Phase 2: Running other consistency checks..."
# npx tsx scripts/another-script.ts

echo -e "\n✅ All migrations and checks completed!"
