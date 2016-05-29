'use strict'
//console.log("pls");
jest.unmock("../hyperproduct");

describe('HyperProduct.query', () => {
    const HyperProduct = require("../hyperproduct");
    var dimensions = ["size", "color", "packsize"];
    var variants =  [
                        {"size": "L", "color": "white", "packsize": "1", "id": "123"},
                        {"size": "M", "color": "white", "packsize": "3", "id": "456"},
                        {"size": "M", "color": "white", "packsize": "1", "id": "111"},
                        {"size": "L", "color": "black", "packsize": "1", "id": "789"}
                    ];      

    it("returns only valid selectable dimensions and undefined variant if dimensions do not fully specify a variant", () => {           
        let hyperProduct = new HyperProduct(variants, dimensions);       
        var state = hyperProduct.query({"packsize": "3"});
        
        let selDims = Object.keys(state.selectableDimensions);
        expect(selDims.length).toBe(2);
        expect(typeof selDims["size"] !== undefined).toBe(true);
        expect(typeof selDims["color"] !== undefined).toBe(true);
        expect(setEquals(state.selectableDimensions.size, new Set(["M"]))).toBe(true);
        expect(setEquals(state.selectableDimensions.color, new Set(["white"]))).toBe(true);
        expect(state.selectedVariant).toBe(undefined);
    });
});

function setEquals(as, bs) {
    if (as.size !== bs.size) return false;
    for (var a of as) if (!bs.has(a)) return false;
    return true;
}