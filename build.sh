mkdir nodejs
cp package.json nodejs
cp package-lock.json nodejs
cd nodejs
npm i --production
cd ..
zip -r dependencies.zip nodejs
rm -rf nodejs
