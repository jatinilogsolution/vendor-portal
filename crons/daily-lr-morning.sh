
NEXTJS_APP_URL="http://localhost:3000"
curl -X GET "${NEXTJS_APP_URL}/api/cron-task" >> ../logs/vendor-portal.log 2>&1
