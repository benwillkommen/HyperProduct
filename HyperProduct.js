'use strict'

var HyperProduct = function(variants, dimensions){
	var self = this;

	//TODO: make dimensions an object with keys that are dimension names, and values
	//that are configuration, e.g. default dimension values
	var sortedDimensions = dimensions.sort();
	var variantHashTable = {};
	var selectedDimensions = {};

	var formatKey = function(variant){
		var dimensionValues = []
		for (var i = 0; i < sortedDimensions.length; i++){
			dimensionValues.push(variant[sortedDimensions[i]])
		}
		return dimensionValues.join(":");
	}

	for (var i = 0; i < variants.length; i++){
		let variant = variants[i];
		variantHashTable[formatKey(variant)] = variant;
	}

	self.getVariant = function(variantDimensions) {
		if (Object.keys(variantDimensions).length < sortedDimensions.length){
			return undefined;
		}
		return variantHashTable[formatKey(variantDimensions)];
	}

	self.getSelectableDimensions = function(){
		let selectableDimensions = {};
		var dimensionsToReturn = sortedDimensions.filter(function(val){
			return typeof selectedDimensions[val] === "undefined";
		});
		
		for (var i = 0; i < dimensionsToReturn.length; i++){
			selectableDimensions[dimensionsToReturn[i]] = new Set();
		}

		for (var i = 0; i < variants.length; i++){
			var variant = variants[i];
			var dimensionCombinationExists = true;
			for (let d in selectedDimensions){
				if (typeof d === "undefined"){
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
		return selectableDimensions;
	}

	self.getState = function(){
		return {
			selectedDimensions: selectedDimensions,
			selectableDimensions: self.getSelectableDimensions(),
			selectedVariant: self.getVariant(selectedDimensions)
		};
	};

	self.setDimension = function(key, value){
		selectedDimensions[key] = value;
	}
};

module.exports = HyperProduct;