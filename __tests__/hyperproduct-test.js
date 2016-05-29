'use strict'
//console.log("pls");
jest.unmock("../hyperproduct");

describe('HyperProduct.getVariant', () => {
    const HyperProduct = require("../hyperproduct");
    var dimensions = ["size", "color"];
    var variants =  [
                        {"size": "L", "color": "white", "id": "123"},
                        {"size": "M", "color": "white", "id": "456"},
                        {"size": "L", "color": "black", "id": "789"}
                    ];  
    var hyperProduct = new HyperProduct(variants, dimensions);

    it("returns the variant when dimensions passed in match a variant", () => {           
        var variant = hyperProduct.getVariant({"size":"M", "color": "white"});
        expect(variant).toBe(variants[1]);
    });

    it("returns undefined when incomplete dimensions are passed in", () => {
        var variant = hyperProduct.getVariant({"size":"M"});
        expect(variant).toBe(undefined);
    });

});

describe('HyperProduct.setDimension', () => {
    const HyperProduct = require("../hyperproduct");
    var dimensions = ["size", "color", "packsize"];
    var variants =  [
                        {"size": "L", "color": "white", "packsize": "1", "id": "123"},
                        {"size": "M", "color": "white", "packsize": "3", "id": "456"},
                        {"size": "M", "color": "white", "packsize": "1", "id": "111"},
                        {"size": "L", "color": "black", "packsize": "1", "id": "789"}
                    ];      

    it("returns a state with only valid selectable dimensions and correct selected dimensions", () => {           
        let hyperProduct = new HyperProduct(variants, dimensions);       
        var state = hyperProduct.setDimension("packsize", "3");
        
        let selDims = Object.keys(state.selectableDimensions);
        expect(selDims.length).toBe(2);
        expect(typeof selDims["size"] !== undefined).toBe(true);
        expect(typeof selDims["color"] !== undefined).toBe(true);
        expect(setEquals(state.selectableDimensions.size, new Set(["M"]))).toBe(true);
        expect(setEquals(state.selectableDimensions.color, new Set(["white"]))).toBe(true);
    });
});


function setEquals(as, bs) {
    debugger;
    if (as.size !== bs.size) return false;
    for (var a of as) if (!bs.has(a)) return false;
    return true;
}