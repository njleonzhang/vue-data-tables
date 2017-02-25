var exceSync = require('child_process').execSync
var version = process.argv.slice(2)[0]

console.log(version)
exceSync('npm run build')
console.log('build done...')
exceSync('npm run demo')
console.log('build demo done...')

exceSync('git add .')
exceSync(`git commit -m "release ${version}"`)
exceSync(`git push`)
console.log('push done...')

exceSync('npm publish')
console.log('publish...')
