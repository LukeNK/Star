# Main
win: preBuild winSetup winPort postBuild

# General
preBuild:
	echo "./" > user/lastSessionPath
	-rm ../build/* -R

postBuild:
	mv dist/Star* ../build
	rm dist/* -R

# Windows
winSetup: 
	npx electron-builder -w

winPort:
	npx electron-builder --win portable