const ui = require('ui-lib/library')
const core = require('sorterimages/core')
const { alphaThreshold } = require('./core')

const menu = {
    dialog: null
}

function constructTextureRegion(pixmap) {
    return new TextureRegion(new Texture(pixmap))
}

menu.buildDialog = function () {
    ui.onLoad(() => {
        const d = new BaseDialog("SorterImages")
        var sizeCell
        var alphaSlider = new Slider(
            0,
            255,
            1,
            false
        )
        alphaSlider.setValue(core.alphaThreshold)
        var alphaTable = new Table()
        alphaTable.label(() => alphaSlider.getValue().toString()).padLeft(6)
        alphaTable.touchable = Touchable.disabled
        alphaSlider.moved(alphaThreshold => {
            core.setAlphaThreshold(alphaThreshold)
        })
        var successCell
        //var imageCell
        
        d.cont.add('Select an image : ')
        d.cont.button('Browse', Icon.fileImage, () => {
                readBinFile('Select image to import', 'png', bytes => {
                    try {
                        core.setImage(new Pixmap(bytes))
                        successCell.get().setText('Successfully loaded file')
                        //imageCell.get().setDrawable(constructTextureRegion(core.getImageOrBlank()))
                    } catch (e) {
                        ui.showError('Failed to load file', e)
                        successCell.get().setText('Error loading file')
                    }
                })
        }).size(240, 50)
        d.cont.row()
        d.cont.add('Size of generated schematic (max 40) : ')
        sizeCell = d.cont.area('20', (str) => core.setSize(java.lang.Integer.parseInt(str))).size(120, 50)
        sizeCell.get().setFilter(TextField.TextFieldFilter.digitsOnly)
        d.cont.row()
        d.cont.add('Alpha threshold : ')
        d.cont.stack(alphaSlider, alphaTable).size(600, 50)
        d.cont.row()
        successCell = d.cont.add('')
        //imageCell = d.cont.image(constructTextureRegion(core.getImageOrBlank()))
        
        d.addCloseButton()
        d.buttons.button('Export schematic', Icon.export, () => {
            try {
                //core.setSize(java.lang.Integer.parseInt(sizeCell.get().getText()))
                core.exportImage()
                successCell.get().setText('Successfully exported schematic')
                //imageCell.get().setDrawable(constructTextureRegion(core.getImageOrBlank()))
                Vars.ui.schematics.hide()
                d.hide()
                Vars.control.input.useSchematic(core.schematic)
            } catch (e) {
                ui.showError('Failed to export schematic', e)
                successCell.get().setText('Error exporting schematic')
            }
        }).disabled(() => !core.image)

        d.addCloseListener()
        d.hidden(() => successCell.get().setText(''))

        this.dialog = d
    })
}

menu.init = function () {
    ui.onLoad(() => {
        this.buildDialog()
        ui.addMenuButton(
            'SorterImages',
            'effect',
            () => this.dialog.show()
        )
        Vars.ui.schematics.buttons.button(
            'SorterImages',
            Icon.effect,
            () => this.dialog.show()
        )
    })
}

module.exports = menu