const Fuse = require('fuse.js');

function searchItemsByTag(tag, items) {
    const fuse = new Fuse(items, {
        keys: ['tags'] 
    });
    return fuse.search(tag);
}

module.exports = searchItemsByTag;