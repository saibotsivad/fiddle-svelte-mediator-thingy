const mannish = require('mannish')
const Component = require('./Component.html')

// create your mediator and add providers
const mediator = mannish()
require('./provider')(mediator) // globbed though

global.svelteMediator = mediator

const app = new Component({
    target: document.querySelector('body')
})
