var exceSync = require('child_process').execSync
var version = process.argv.slice(2)[0]

console.log(version)
exceSync('npm run build')
console.log('build done...')

exceSync('npm publish')
console.log('npm publish done...')

exceSync('git add .')
exceSync(`git commit -m "release ${version}"`)
console.log('git push done...')
