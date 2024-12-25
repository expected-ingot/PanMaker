window.panmaker = {}

window.panmaker.activeFileReader = new FileReader() // This will be used to read the active file
window.panmaker.activeFileReader.onload = function() {
    window.panmaker.activeFile = this.result
    console.log(window.panmaker.activeFile)
    window.panmaker.activeFileData = new DataView(window.panmaker.activeFile)
    console.log(window.panmaker.activeFileData)
    window.panmaker.prepareForRead()
}
window.panmaker.activeFileData = null // This will be a DataView of the active file
window.panmaker.activeFile = null // This will later be an ArrayBuffer

window.panmaker.handleFile = function() {
    // Use this as the callback in a event listener for "change" in a file input element
    console.log(this.files[0].size)
    window.panmaker.activeFileReader.readAsArrayBuffer(this.files[0])
}

// -- FILE READING
window.panmaker.readByte = function() {
    if (window.panmaker.activeFileData.offset >= window.panmaker.activeFileData.byteLength) {
        return null
    }
    window.panmaker.activeFileData.offset += 1
    console.log(window.panmaker.activeFileData.offset)
    return window.panmaker.activeFileData.getUint8(window.panmaker.activeFileData.offset)
}

window.panmaker.readNBytes = function(n, asText = false) {
    var result = []
    for (let i = 0; i < n; i++) {
        result.push(window.panmaker.readByte())
    }
    // result.reverse()
    
    if (asText) {
        return String.fromCharCode(...result)
    }

    return result
}

window.panmaker.prepareForRead = function() {
    window.panmaker.activeFileData.offset = -1
}

// -- FILE READING: CHUNKS
window.panmaker.chunks = {}

window.panmaker.readChunk = function() {
    var chunkName = window.panmaker.readNBytes(4, true)
    switch (chunkName) {
        case "FORM":
            window.panmaker.chunks.form = {}
            window.panmaker.chunks.form.size = window.panmaker.activeFileData.getInt32(window.panmaker.activeFileData.offset)
            window.panmaker.activeFileData.offset += 4
            break
        case "GEN8":
            window.panmaker.chunks.gen8 = {}
            window.panmaker.chunks.gen8.size = window.panmaker.activeFileData.getInt32(window.panmaker.activeFileData.offset)
            window.panmaker.activeFileData.offset += 4
            window.panmaker.chunks.gen8.debug = window.panmaker.readByte()
            break
    }
}