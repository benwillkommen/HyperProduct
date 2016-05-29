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

    it("returns the variant when dimensions passed in match a variant", () =>{           
        var variant = hyperProduct.getVariant({"size":"M", "color": "white"});
        expect(variant).toBe(variants[1]);
    });

    it("returns undefined when incomplete dimensions are passed in", () => {
        var variant = hyperProduct.getVariant({"size":"M"});
        expect(variant).toBe(undefined);
    });

});
