
Please revise doc and unit test if you change any behavior.

## document
The document is powered by [docsify](https://docsify.js.org/#/) and [docsify-demo-box-vue](https://njleonzhang.github.io/docsify-demo-box-vue/#/)

* install docsify
```
npm i docsify-cli -g
```

* go to project folder and run local server
```
docsify serve docs
```
You can preview your site in your browser on http://localhost:3000 with hot reload.

## unit test
The unit test is based on karma and mocha, please make sure you change can pass the unit test, and add necessary unit test for your change.

```
timeout=6000 npm run test
```
