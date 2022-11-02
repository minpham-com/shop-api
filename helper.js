const isBase64 = (v, opts) => {
    if (v instanceof Boolean || typeof v === 'boolean') {
        return false
    }

    if (!(opts instanceof Object)) {
        opts = {}
    }

    if (opts.allowEmpty === false && v === '') {
        return false
    }

    var regex = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+\/]{3}=)?'
    var mimeRegex = '(data:\\w+\\/[a-zA-Z\\+\\-\\.]+;base64,)'

    if (opts.mimeRequired === true) {
        regex =  mimeRegex + regex
    } else if (opts.allowMime === true) {
        regex = mimeRegex + '?' + regex
    }

    if (opts.paddingRequired === false) {
        regex = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}(==)?|[A-Za-z0-9+\\/]{3}=?)?'
    }

    return (new RegExp('^' + regex + '$', 'gi')).test(v)
}

const isString = (v) => typeof v === 'string' || v instanceof String

const base64Decode = (v) => {
    try {
        const buff = Buffer.from(v, 'base64');
        return buff.toString('ascii');
    }catch(e){
        console.log('base64Decode error', e)
        return v
    }
}

const getPrivateKey = (v) => {
    v = decodeURIComponent(v);
    if( isString(v) && isBase64(v)) {
        v = base64Decode(v)
    }
    return JSON.parse(v)
    //return JSON.stringify(v.split(String.raw`\n`).join('\n'))
    //return JSON.stringify(v)
}

module.exports = getPrivateKey
