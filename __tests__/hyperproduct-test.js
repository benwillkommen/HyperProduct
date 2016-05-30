'use strict'
//console.log("pls");
jest.unmock("../hyperproduct");

describe('HyperProduct constructor', () => {
    const HyperProduct = require("../hyperproduct");
    let dimensions = ["size", "color", "packsize"];
    let variants =  [
                        {"size": "L", "color": "white", "packsize": "1", "id": "123"},
                        {"size": "M", "color": "white", "packsize": "3", "id": "456"},
                        {"size": "M", "color": "white", "packsize": "1", "id": "111"},
                        {"size": "L", "color": "black", "packsize": "1", "id": "789"}
                    ];      

    it("defaults variant dimension values if not present and default dimensions are passed in", () => {           
        let variantsWithIncompleteDimensions =  [
                        {"size": "L", "color": "white", "id": "123"},
                        {"size": "M", "color": "white", "packsize": "3", "id": "456"},
                        {"size": "M", "color": "white", "packsize": "3", "id": "111"},
                        {"size": "L", "color": "black", "packsize": "3", "id": "789"}
                    ];      
        let defaults = {"packsize": "1"};

        let hyperProduct = new HyperProduct(variantsWithIncompleteDimensions, dimensions, defaults);       
        let results = hyperProduct.query({"size": "L", "color": "white", "packsize": "1"});        
        
        expect(results.selectedVariant).toEqual({"size": "L", "color": "white", "packsize": "1", "id": "123"});
    });

    it("throws an exception when variant dimension values are not present and no default is found", () => {           
        let variantsWithIncompleteDimensions =  [
                        {"size": "L", "color": "white", "id": "123"},
                        {"size": "M", "color": "white", "packsize": "3", "id": "456"},
                        {"size": "M", "color": "white", "packsize": "3", "id": "111"},
                        {"size": "L", "color": "black", "packsize": "3", "id": "789"}
                    ];             

        expect(() => {new HyperProduct(variantsWithIncompleteDimensions, dimensions)}).toThrow();
    });

});

describe('HyperProduct.query', () => {
    const HyperProduct = require("../hyperproduct");
    let dimensions = ["size", "color", "packsize"];
    let variants =  [
                        {"size": "L", "color": "white", "packsize": "1", "id": "123"},
                        {"size": "M", "color": "white", "packsize": "3", "id": "456"},
                        {"size": "M", "color": "white", "packsize": "1", "id": "111"},
                        {"size": "L", "color": "black", "packsize": "1", "id": "789"}
                    ];      

    it("returns only valid selectable dimensions and undefined variant with incomplete dimensions ", () => {           
        let hyperProduct = new HyperProduct(variants, dimensions);       
        let results = hyperProduct.query({"packsize": "3"});
                
        expect(results.selectableDimensions).toEqual({"color": new Set(["white"]), "size": new Set(["M"])})        
        expect(results.selectedVariant).toBeUndefined();
    });

    it("returns undefined variant and no selectable dimensions with dimensions that do not exist for any variants", () => {           
        let hyperProduct = new HyperProduct(variants, dimensions);       
        let results = hyperProduct.query({"packsize": "12"});

        let selectableDimensionKeys = Object.keys(results.selectableDimensions);
        expect(selectableDimensionKeys.length).toBe(0);
        expect(results.selectedVariant).toBeUndefined();
    });

});

function setEquals(as, bs) {
    if (as.size !== bs.size) return false;
    for (let a of as) if (!bs.has(a)) return false;
    return true;
}