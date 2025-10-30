
NEXTJS_APP_URL="https://vendorportal.awlindia.com"
curl -X GET "${NEXTJS_APP_URL}/api/cron-task" >> ../logs/vendor-portal.log 2>&1
