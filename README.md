
# vendor-portal



45 5 * * * curl -s http://192.168.146.97/api/cron-task/vendor-import >> ~/var/www/cron-logs/vendor.log 2>&1
0  6 * * * curl -s http://192.168.146.97/api/cron-task >> ~/var/www/cron-logs/lr.log 2>&1
15 6 * * * curl -s http://192.168.146.97/api/cron-task/pod-import >> ~/var/www/cron-logs/pod.log 2>&1
