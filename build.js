const browserify = require('browserify')
const sveltify = require('sveltify')

// the transform
const svelteMediator = require('./svelte-mediator')

const b = browserify()

// b.transform(sveltify)
b.transform(svelteMediator, {
    component: 'mediatorCall',
    global: 'svelteMediator'
})

b.add('./app.js')

b.bundle().pipe(process.stdout)

/*
  "browserify": {
    "transform": [
      [
        "babelify",
        {
          "presets": "es2015"
        }
      ]
    ]
  },
*/
