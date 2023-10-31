#!/bin/bash
cd knowledge-exchange-deployment/

sudo docker-compose down

sudo cp /etc/letsencrypt/live/sedaltd.com/privkey.pem research_institutes/privkey.pem
sudo cp /etc/letsencrypt/live/sedaltd.com/fullchain.pem research_institutes/fullchain.pem

sudo cp /etc/letsencrypt/live/sedaltd.com/fullchain.pem research_resources/fullchain.pem
sudo cp /etc/letsencrypt/live/sedaltd.com/privkey.pem research_resources/privkey.pem

sudo cp /etc/letsencrypt/live/sedaltd.com/fullchain.pem users/fullchain.pem
sudo cp /etc/letsencrypt/live/sedaltd.com/privkey.pem users/privkey.pem

sudo docker-compose -f docker-compose-back.yaml up -d