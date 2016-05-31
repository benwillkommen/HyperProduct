'use strict'

let HyperProduct = function(variants, dimensions, defaultDimensionValues){
	let self = this;

	let sortedDimensions = dimensions.sort();
	let defaults = defaultDimensionValues || {};
	let variantHashTable = {};

	let formatKey = function(variantDimensions){
		let dimensionValues = []
		for (let i = 0; i < sortedDimensions.length; i++){
			dimensionValues.push(variantDimensions[sortedDimensions[i]])
		}
		return dimensionValues.join(":");
	}

	let ensureDimensions = function(variant){
		for (let i = 0; i < sortedDimensions.length; i++){
			if(!(sortedDimensions[i] in variant)){
				if(sortedDimensions[i] in defaults) {
					variant[sortedDimensions[i]] = defaults[sortedDimensions[i]];
				}
				else {
					throw "Variant encountered with no dimension value for \"" + sortedDimensions[i] + "\" and no default dimension value."
				}
			}
		}
	};

	for (let i = 0; i < variants.length; i++){
		let variant = variants[i];
		ensureDimensions(variant);
		variantHashTable[formatKey(variant)] = variant;
	}

	let getVariant = function(variantDimensions) {
		if (Object.keys(variantDimensions).length < sortedDimensions.length){
			return undefined;
		}
		return variantHashTable[formatKey(variantDimensions)];
	}

	let getSelectableDimensions = function(selectedDimensions){
		let selectableDimensions = {};
		let dimensionsToReturn = sortedDimensions.filter(function(val){
			return typeof selectedDimensions[val] === "undefined";
		});

		for (let i = 0; i < dimensionsToReturn.length; i++){
			selectableDimensions[dimensionsToReturn[i]] = new Set();
		}

		for (let i = 0; i < variants.length; i++){
			let variant = variants[i];
			let dimensionCombinationExists = true;
			for (let d in selectedDimensions){
				if (typeof selectedDimensions[d] === "undefined"){
					//no selection has been made for this dimension
					continue;
				}
				if(variant[d] === selectedDimensions[d]){
					//current variant could have dimension values matching selected dimensions
					continue;
				}
				//if we get here, the variant has a dimension that does not match the selected dimesions
				dimensionCombinationExists = false;
				break;
			}

			if (dimensionCombinationExists){
				//add dimensions of this variant to the selectable dimensions ONLY for dimensions that
				//are not currently selected
				for (let d in selectableDimensions){
					selectableDimensions[d].add(variant[d]);
				}
			}
		}

		//if any dimensions have no values in thier set, delete the keys
		for (let d in selectableDimensions){
			if (selectableDimensions[d].size === 0)
				delete selectableDimensions[d];
		}

		return selectableDimensions;
	}

	self.query = function(dimensions){
		return {
			selectableDimensions: getSelectableDimensions(dimensions),
			selectedVariant: getVariant(dimensions)
		};
	};
};

module.exports = HyperProduct;