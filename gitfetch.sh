#!/bin/bash

# On Ubuntu 18 Bionic Beaver
# crontab -e  edit cron jobs
# crontab -l  view cron jobs
# * * * * * /root/guitar/gitfetch.sh
# * * * * * env > /root/guitar/cronticker

cd /root/guitar
git fetch -p
git pull -r
