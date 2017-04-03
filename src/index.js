const changelog = require('conventional-changelog')
const fs = require('fs')
const path = require('path')

function readAbsolute (name) {
  return fs.readFileSync(path.resolve(__dirname, name), 'utf-8')
}

function readRelative (name) {
  return fs.readFileSync(name, 'utf-8')
}

module.exports = function (pluginConfig, options, cb) {
  const pkg = options.pkg

  const pkgOptions = pkg.generateNotes || {}
  const writerOpts = {}

  writerOpts.commitPartial = pkgOptions.commitPartial ? readRelative(pkgOptions.commitPartial) : readAbsolute('../templates/commit.hbs')
  writerOpts.headerPartial = pkgOptions.headerPartial ? readRelative(pkgOptions.headerPartial) : readAbsolute('../templates/header.hbs')
  
  if (pkgOptions.mainTemplate) {
    writerOpts.mainTemplate = readRelative(pkgOptions.mainTemplate)
  }

  if (pkgOptions.footerPartial) {
    writerOpts.footerPartial = readRelative(pkgOptions.footerPartial)
  }

  const stream = changelog({
    preset: pkg.genlogPreset ? pkg.genlogPreset : 'angular'
  }, null, null, null, writerOpts)

  var bufs = []
  stream.on('data', function (d) { bufs.push(d) })

  stream.on('end', function () {
    var buf = Buffer.concat(bufs)
    cb(null, buf.toString('utf-8'))
  })

  stream.on('error', function (e) {
    cb(e)
  })
}
