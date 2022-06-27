function ColorObject(r, g, b, a) {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
}

ColorObject.fromIntRGBA = function (number) {
    const   r = (number >> 24) & 255,
            g = (number >> 16) & 255,
            b = (number >> 8)  & 255,
            a = (number >> 0)  & 255
    return new ColorObject(r, g, b, a)
}

ColorObject.fromJavaColor = function (javaColor) {
    return new ColorObject(javaColor.r * 255, javaColor.g * 255, javaColor.b * 255, javaColor.a * 255)
}

ColorObject.prototype.distanceTo = function (other) {
    var rd = (this.r - other.r), gd = (this.g - other.g), bd = (this.b - other.b)
    return rd*rd + gd*gd + bd*bd
}

ColorObject.prototype.toString = function () {
    return '[Color r=' + this.r + ' g=' + this.g + ' b=' + this.b + ' a=' + this.a
}

module.exports = ColorObject