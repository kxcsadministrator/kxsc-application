#!/bin/bash
cd knowledge-exchange-deployment/

sudo docker-compose down

sudo cp /etc/letsencrypt/live/moniat60.com.ng/privkey.pem research_institutes/privkey.pem
sudo cp /etc/letsencrypt/live/moniat60.com.ng/fullchain.pem research_institutes/fullchain.pem

sudo cp /etc/letsencrypt/live/moniat60.com.ng/fullchain.pem research_resources/fullchain.pem
sudo cp /etc/letsencrypt/live/moniat60.com.ng/privkey.pem research_resources/privkey.pem

sudo cp /etc/letsencrypt/live/moniat60.com.ng/fullchain.pem users/fullchain.pem
sudo cp /etc/letsencrypt/live/moniat60.com.ng/privkey.pem users/privkey.pem

sudo docker-compose -f docker-compose-back.yaml up -d