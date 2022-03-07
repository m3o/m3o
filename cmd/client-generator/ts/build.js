const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')

function moveToTopLevel() {
  const esmDirectories = fs
    .readdirSync('./tmp/esm')
    .filter((file) => fs.statSync(`./tmp/esm/${file}`).isDirectory())

  esmDirectories.forEach((directory) => {
    const tmpFolder = path.join(__dirname, 'tmp', directory)
    const tmpEsmFolder = path.join(__dirname, 'tmp/esm', directory)
    const folder = path.join(__dirname, directory)

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder)
      fs.mkdirSync(path.join(folder, 'esm'))
    }

    const files = fs.readdirSync(path.join(__dirname, 'tmp/esm', directory))

    files.forEach((file) => {
      // Copy esm
      fs.renameSync(
        path.join(tmpEsmFolder, file),
        path.join(folder, 'esm', file)
      )

      // Copy compiled files
      fs.renameSync(path.join(tmpFolder, file), path.join(folder, file))
    })

    fs.writeFileSync(
      `${folder}/package.json`,
      `{"module": "./esm/index.js"}`,
      'utf8'
    )
  })
}

function replacePathsInIndex() {
  const indexFile = path.join(__dirname, 'esm', 'index.js')

  fs.readFile(indexFile, 'utf8', function (err, data) {
    if (err) {
      return console.log(err)
    }

    let result = data.replace(/from \".\//g, 'from "../')

    console.log(result)

    fs.writeFile(indexFile, result, 'utf8', function (err) {
      if (err) return console.log(err)
      console.log('done')
    })
  })
}

function makeTopEsmFolder() {
  const esmFolder = path.join(__dirname, 'esm')
  const tmpFolder = path.join(__dirname, 'tmp')

  if (!fs.existsSync(esmFolder)) {
    fs.mkdirSync(esmFolder)
  }

  fs.renameSync(
    path.join(tmpFolder, 'esm', 'index.js'),
    path.join(esmFolder, 'index.js')
  )

  fs.renameSync(
    path.join(tmpFolder, 'index.js'),
    path.join(__dirname, 'index.js')
  )

  fs.renameSync(
    path.join(tmpFolder, 'index.d.ts'),
    path.join(esmFolder, 'index.d.ts')
  )
}

async function build() {
  moveToTopLevel()
  makeTopEsmFolder()
  replacePathsInIndex()

  rimraf(path.join(__dirname, 'tmp'), (err) => {
    console.log(err)
  })
}

build()
