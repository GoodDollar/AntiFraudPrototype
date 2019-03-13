deploy-api:
	git subtree push --prefix api heroku master

deploy-web:
	cd web && \
	now --build-env REACT_APP_ZOOM_LICENSE_KEY=d4QcD1WU4s5srMoJeDe2YDIIvy2AaMI0 --build-env REACT_APP_API_URL=https://gd-anti-fraud-prototype-api.herokuapp.com && \
	now alias


.PHONY: deploy-api deploy-web
