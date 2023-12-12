const FgetArandom = (min, max) => {
    return parseInt((Math.random() * max - min) + 10000000)
}
module.exports=FgetArandom