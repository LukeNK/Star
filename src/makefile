# Main
win: preBuild winSetup winPort postBuild

# General
preBuild:
# echo ./ > user/lastSessionPath (rember to fix newline)
	-rm ../build/* -R

postBuild:
	mv dist/Star* ../build
	rm dist/* -R

testDir: 
	-rm test -R
	-mkdir test
	echo Hello world > test/a.txt
	echo toDEL > test/delete.txt
	echo toMov > test/move.txt

# Windows
winSetup: 
	npx electron-builder -w

winPort:
	npx electron-builder --win portable