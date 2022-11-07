#!/bin/bash
default() {
    startAPI
}
installAPI() {
    npm install --prefix api
    echo "API Packages Installed"
}


startAPI() {
    cd api && npm run-script test
}

startProd() {
    cd api && npm run-script prod

}

"${@:-default}"
