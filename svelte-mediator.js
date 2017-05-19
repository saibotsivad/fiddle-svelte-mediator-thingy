const { basename, extname } = require('path')
const through = require('through2')
const { compile } = require('svelte')

const defaultExtensions = [ '.html', '.svelte' ]
const mediatorFunctionText = (component, caller, globalName) => `${component}.prototype.${caller} = function(name, ...args) {
    return global.${globalName}.call(name, ...args)
}
`

module.exports = function svelteMediator(file, options = {}) {
    const extensionsArray = (options.extensions && options.extensions._) || defaultExtensions
    const extension = extname(file)

    const nameOfComponentCalled = options.component || 'mediatorCall'
    const nameOfGlobalProperty = options.global || 'svelteMediator'

    let data = ''

    function write(chunk, enc, cb) {
        data += chunk
        cb()
    }

    function end(cb) {
        const base = basename(file)
        const name = sanitizeJavaScriptFunctionName(base.replace(extension, ''))

        try {
            const { code, map } = compile(data, {
                name,
                filename: base,
                format: 'cjs'
            })
            const mediatorCode = mediatorFunctionText(name, nameOfComponentCalled, nameOfGlobalProperty)
            this.push(code + '\n\n' + mediatorCode)
            this.push('\n//# sourceMappingURL=' + map.toUrl())
            cb()
        } catch (err) {
            cb(err)
        }
    }

    if (extensionIsInList(extension, extensionsArray)) {
        return through(write, end)
    } else {
        return through()
    }
}

function extensionIsInList(extension, extensionsArray) {
    return extensionsArray.indexOf(extension.toLowerCase()) !== -1
}

function sanitizeJavaScriptFunctionName(text) {
    return text.replace(/\W/g, '')
}
