#---------------------------------------------------#
all:
	tsc
	$(MAKE) run

run:
	$(MAKE) builder
	docker run -p 49160:8080 ebillon/node-web-app

detach:
	$(MAKE) builder
	docker run -p 49160:8080 -d ebillon/node-web-app

builder:
	docker build . -t ebillon/node-web-app
#---------------------------------------------------#