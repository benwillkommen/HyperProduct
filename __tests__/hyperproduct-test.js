'use strict'
//console.log("pls");
jest.unmock("../hyperproduct");
jest.autoMockOff();



describe("HyperProduct.getVariant", () => {
	it("returns a variant given dimensions"), () => {
		var HyperProduct = require("../hyperproduct");
		var dimensions = ["size", "color"];
		var variants = 	[
							{"size": "L", "color": "white", "id": "123"},
							{"size": "M", "color": "white", "id": "456"},
							{"size": "L", "color": "black", "id": "789"}
						];
		console.log("pls")
		var hyperProduct = new HyperProduct(variants, dimensions);

		var variant = hyperProduct.getVariant({"size":"M", "color": "white"});

		//wtf jest?
		expect(variant).toBe(false);
	};
	
});

describe("HyperProduct.getSelectableDimensions", () => {

	it("returns selectable dimensions"), () => {
		var HyperProduct = require("../hyperproduct");
		var dimensions = ["size", "color"];
		var variants = 	[
							{"size": "L", "color": "white", "id": "123"},
							{"size": "M", "color": "white", "id": "456"},
							{"size": "L", "color": "black", "id": "789"}
						];
		debugger;
		var hyperProduct = new HyperProduct(variants, dimensions);

		var selectableDimensions = hyperProduct.getSelectableDimensions();
		console.log(selectableDimensions);
		expect(true).toBe(true);
	}
});
