let demoViewModel = function(variants, dimensions, defaults){
    let self = this;

    let hyperProduct = new HyperProduct(variants, dimensions, defaults);

    self.getSelectedDimensions = () => {
        let selectedDimensions = {};
        self.dimensions.forEach((dimensionArray) => {
            dimensionArray.forEach((e) => {
                if (e.selected()){
                    selectedDimensions[e.name] = e.value;
                }
            });
        });
        return selectedDimensions
    };

    let toggleDimension = (element) => {
        if (element.enabled() || element.selected()){

            //for the clicked dimension, unselect all the other values
            self.dimensions.filter((e) => {return e[0].name === element.name}).forEach((item, index, array)=>{
                item.forEach((e, i, a) => {
                    if (e.value !== element.value){
                        e.selected(false);
                    }
                });
            });

            if (!element.selected()){
                //toggling from not selected to not selected
                element.selected(true);
            }
            else {
                //toggling from not selected to selected
                element.selected(false);
            }

            let queryParameters = self.getSelectedDimensions();

            let results = hyperProduct.query(queryParameters);
            console.log(results);

            if (typeof results.selectedVariant === "undefined"){
                let queryKeys = Object.keys(queryParameters);
                self.dimensions.forEach((dimensionArray) => {
                    dimensionArray.forEach((e) => {
                        if (queryKeys.length === 1 && e.name === queryKeys[0]) {
                            //only one dimension is specified.
                            //don't disable selected dimensions controls
                            e.enabled(true);
                        }
                        else if (typeof results.selectableDimensions[e.name] !== "undefined" && results.selectableDimensions[e.name].has(e.value)){
                            //query results show that this element is selectable.
                            //enable it
                            e.enabled(true);
                        }
                        else {
                            e.enabled(false);
                        }
                    });
                });
            }
            self.lastQueryResults(results);

        }
    }

    self.dimensions = [];
    dimensions.forEach((item, index, array) => {
        self.dimensions.push(Array.from(new Set(variants.map((v) => {
            return v[item];
        }))).map((s) => {
            return {
                        "name": item,
                        "value":s,
                        "toggleDimension": toggleDimension,
                        "enabled": ko.observable(true),
                        "selected": ko.observable(false)
                    }
        }));
    });

    self.lastQueryResults = ko.observable();

    self.formattedLastQueryResults = ko.computed(() => {
        let results = self.lastQueryResults();
        if (typeof results === "undefined"){
            return JSON.stringify({});
        }

        let formattedResults = {
            selectedVariant: results.selectedVariant,
            selectableDimensions: {}
        };


        for(let dimension in results.selectableDimensions){
            formattedResults.selectableDimensions[dimension] = Array.from(results.selectableDimensions[dimension]);
        }
        return JSON.stringify(formattedResults, undefined, 2);
    });

};