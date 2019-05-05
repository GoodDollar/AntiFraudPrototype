deploy-api:
	git subtree push --prefix api heroku master

deploy-web:
	cd web && \
	now --build-env REACT_APP_ZOOM_LICENSE_KEY=dmm5F80v71kkNcm3inG3DcAUadIlE5K4 --build-env REACT_APP_API_URL=http://localhost:3001 && \
	now alias


.PHONY: deploy-api deploy-web
