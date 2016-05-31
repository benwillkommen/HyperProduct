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

    let selectDimension = (element) => {
        if(!element.enabled()){
            //clicked element not enabled, do nothing
            return;
        }

        let queryParameters = self.getSelectedDimensions();

        queryParameters[element.name] = element.value;

        let results = hyperProduct.query(queryParameters);
        console.log(results);
        self.lastQueryResults(results);

        if (typeof results.selectedVariant === "undefined"){
            if (Object.keys(results.selectableDimensions).length === 0){
                //invalid selection made somehow, do nothing
                return;
            }

            self.dimensions.forEach((dimensionArray) => {
                dimensionArray.forEach((e) => {
                   if (typeof results.selectableDimensions[e.name] === "undefined" || results.selectableDimensions[e.name].has(e.value)){
                        e.enabled(true);
                    }
                    else{
                        e.enabled(false);
                    }
                });
            });
        }
        else {
            //a variant was selected! enable all the controls
            self.dimensions.forEach((dimensionArray) => {
                dimensionArray.forEach((item, index, array) => {
                    item.enabled(true);
                });
            });
        }

        //for the new selected dimension, unselect all the other values, and select the new one
        self.dimensions.filter((e) => {return e[0].name === element.name}).forEach((item, index, array)=>{
            item.forEach((e, i, a) => {
                e.selected(false);
            });
        });
        element.selected(true);
    }

    self.dimensions = [];
    dimensions.forEach((item, index, array) => {
        self.dimensions.push(Array.from(new Set(variants.map((v) => {
            return v[item];
        }))).map((s) => {
            return {
                        "name": item,
                        "value":s,
                        "selectDimension": selectDimension,
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