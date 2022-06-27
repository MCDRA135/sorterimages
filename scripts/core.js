const ColorObject = require('sorterimages/color')

const MAX_SIZE = 40

const sorterItems = Vars.content.items().toArray()
const sorterColors = sorterItems.map(item => ColorObject.fromJavaColor(item.color))

function getNearestColorItem(color) {
    var index, distance
    sorterColors.forEach((v, i) => {
        var d = color.distanceTo(v)
        if (d < distance || distance === undefined) {
            distance = d
            index = i
        }
    })
    return sorterItems[index]
}

const core = {
    size: 20,
    alphaThreshold: 128,
    image: null,
    schematic: null
}

core.setImage = function (pixmap) {
    this.image = pixmap
    return this.image
}

core.getImageOrBlank = function () {
    return this.image || Pixmaps.blankPixmap()
}

core.setSize = function (size) {
    this.size = Math.min(size, MAX_SIZE)
    return this.size
}

core.setAlphaThreshold = function (alphaThreshold) {
    this.alphaThreshold = alphaThreshold
    return this.alphaThreshold
}

core.readyImage = function () {
    if (this.image.height != this.size || this.image.width != this.size) {
        this.image = Pixmaps.scale(this.image, this.size / this.image.width, this.size / this.image.height)
    }
    return this.image
}

core.buildSchematic = function () {
    this.readyImage()

    var tiles = Seq.of(Schematic.Stile)

    for (var y = 0; y < this.size; y++)
        for (var x = 0; x < this.size; x++) {
            var color = ColorObject.fromIntRGBA(this.image.get(x, y))
            if (color.a >= this.alphaThreshold) {
                tiles.add(new Schematic.Stile(Blocks.sorter, x, this.size-y-1, getNearestColorItem(color), 0))
            }
    }

    const schematicTags = new StringMap()
    schematicTags.put('name', 'Generated by SorterImages')
    this.schematic = new Schematic(tiles, schematicTags, this.size, this.size)

    return this.schematic
}

core.exportImage = function () {
    this.buildSchematic()

    Vars.schematics.add(this.schematic)

    return this.schematic
}

module.exports = core