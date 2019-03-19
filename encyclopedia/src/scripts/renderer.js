'use strict'

//importing the filesystem module
let fs = require('fs');
//reading the json file
let jsonFile = JSON.parse(fs.readFileSync('./pets.json', 'utf8'));
//object that will store all filters
let filters = { animal_type: [], Animal_Gender: [], Animal_Breed: [], Animal_Color: [] }

//populating the select boxes with data from jsonFile
let optSelect = (option, key) => {
    //initialising an array with an empty string
    let arr = [''];

    //adding each unique object value to the empty array
    jsonFile.forEach((item) => {
        if (!arr.includes(item[key])) arr.push(item[key]);
    });

    //creating the HTML DOM option element for each item in the array
    arr.forEach((element) => {
        let opt = document.createElement('option');
        opt.value = element.toLowerCase();
        opt.textContent = element;
        option.appendChild(opt);
    });
}

//adding animal breeds to DOM
optSelect(document.getElementById('breed'), 'Animal_Breed');
//adding animal colors to DOM
optSelect(document.getElementById('color'), 'Animal_Color');

//updates the DOM with passed in data
let updateDOM = (data) => {
    //string containing initial table elements
    let listElement = `
        <thead>
            <tr>
                <th>Animal ID</th>
                <th>Animal Name</th>
                <th>Animal Type</th>
                <th>Animal Gender</th>
                <th>Animal Breed</th>
                <th>Animal Color</th>
                <th>Address</th>
            </tr>
        </thead>
        <tbody>
            <tr>
    `;

    data.forEach((record) => {
        //array containing values from each record
        let objVal = Object.values(record);

        for (let i = 0; i < objVal.length; i++) {
            //if the animal type is 'Dog'...
            if (objVal[i] === 'Dog') {
                //add a link to a picture of a dog in the table cell
                listElement += `<td><a target="_blank" href="https://hips.hearstapps.com/ghk.h-cdn.co/assets/17/30/1500925839-golden-retriever-puppy.jpg">${objVal[i]}</a></td>`;
            //if the animal type is a 'Cat'...
            } else if (objVal[i] === 'Cat') {
                //add a link to a picture of a cat in the table cell
                listElement += `<td><a target="_blank" href="https://i.pinimg.com/236x/52/bc/39/52bc3928fd63daa22ebfb555f9ae07dd.jpg">${objVal[i]}</a></td>`;
            } else {
                //add each value to a separate table cell
                listElement += `<td>${objVal[i]}</td>`;
            }
        }
        
        //close table row
        listElement += '</tr>';
    });

    //update DOM with new table data
    document.getElementById('record').innerHTML = listElement + '</tbody>';
}

//returns an array with all the filtered items
let animalFilter = (filterList) => {
    //filter jsonFile, returns an array with new values
    return jsonFile.filter((animalRecord) => {
        //for every filter in filterList, return either true/ false depending on the condition on line 19
        return Object.keys(filterList).every((key) => {
            //if each key in filterList is empty, return true, otherwise return true/ false if filter is found in main JSON file
            return !filterList[key].length ? true : filterList[key].includes(animalRecord[key].toLowerCase());
        });
    });
}

//get all select boxes
let allSelect = document.querySelectorAll('select');

for (let j = 0; j < allSelect.length; j++) {
    //get the DOM element id of the select box, e.g. 'breed'
    let itemSelec = document.getElementById(allSelect[j].id);
    //depending on value of j, set the object key to objSelectorSelec
    let objSelectorSelec = j == 0 ? 'Animal_Breed' : 'Animal_Color';
    //get the correct array of filters
    let listSelec = filters[objSelectorSelec];

    //if a select box has changed...
    itemSelec.addEventListener('change', () => {
        //if the select box is not empty, add the selected value to listSelec, otherwise, remove it from listSelec
        !(itemSelec.value === '') ? listSelec[0] = itemSelec.value : listSelec.pop();
        //pass updated array of filters through animalFilter and store in passThroughSelec
        let passThroughSelec = animalFilter(filters);
        //update the DOM with filtered data
        updateDOM(passThroughSelec);
    });
}

//array containing all checkbox values
let allCheckbox = ['dog', 'cat', 'male', 'female'];

for (let i = 0; i < allCheckbox.length; i++) {
    //get the DOM element id of the checkbox, e.g. 'dog'
    let itemCheck = document.getElementById(allCheckbox[i]);
    //depending on value of i, set the object key to objSelectorCheck
    let objSelectorCheck = i < 2 ? 'animal_type' : 'Animal_Gender';
    //get the correct array of filters
    let listCheck = filters[objSelectorCheck];

    //if a checkbox has been clicked...
    itemCheck.addEventListener('change', () => {
        //if the checkbox is checked, push value to listCheck, otherwise, remove it from listCheck
        itemCheck.checked ? listCheck.push(itemCheck.value) : listCheck.splice(listCheck.indexOf(itemCheck) - 1, 1);
        //pass updated array of filters through animalFilter and store in passThroughCheck
        let passThroughCheck = animalFilter(filters);
        //update the DOM with filtered data
        updateDOM(passThroughCheck);
    });
}

//show all button event listener, act on click
document.getElementById('all').addEventListener('click', () => {
    //get all checkbox elements in DOM
    let allCheck = document.querySelectorAll('input[type=checkbox]');
    //get all select elements in DOM
    let allSelec = document.querySelectorAll('select');

    //for each key in filters, empty the array
    for (let reset in filters) filters[reset].length = 0;

    for (let x = 0; x < allCheck.length; x++) {
        //get current checkbox element by id
        let valCheck = document.getElementById(allCheck[x].id);
        //if the checkbox is checked, uncheck it
        if (valCheck.checked) valCheck.checked = false;
    }

    for (let y = 0; y < allSelec.length; y++) {
        //get current select element by id
        let valSelec = document.getElementById(allSelec[y].id);
        //if the select box has a value, remove it
        if (valSelec.value !== '') valSelec.value = valSelec[0];
    }

    //clear the search box
    document.getElementById('searchTerm').value = '';
    //render the DOM with the original JSON file
    updateDOM(jsonFile);
});

//when the search button event is called...
document.getElementById('search').addEventListener('click', () => {
    //convert string in search box to lower case and split on a space
    let val = document.getElementById('searchTerm').value.toLowerCase().split(' ');
    
    //if the search box isn't empty
    if (val[0] !== '') {
        //filter jsonFile, returns an array with new values 
        let filtered = jsonFile.filter((animal) => {
            //make all values in each record lower case and store in searchRef
            let searchRef =  Object.values(animal).map(a => a.toLowerCase());

            for (let u = 0; u < searchRef.length; u++) {
                //split all values in each record on a space
                let v = searchRef[u].split(' ');
                //if value in record has more than one keyword, push each keyword to searchRef
                if (v.length > 1) v.forEach(w => searchRef.push(w));
            }

            //truthy, will return true if any search term matches a string in searchRef
            return val ? val.every(b => Object.values(searchRef).includes(b)) : false;
        });

        //update the DOM with filtered data
        updateDOM(filtered);
    }
});

//initialising an empty array
let animalNames = new Array();
//push each animal name to animalNames if it is unique and isn't 'unknown'
jsonFile.forEach(d => { if (!(animalNames.includes(d.Animal_Name) || d.Animal_Name === 'Unknown')) animalNames.push(d.Animal_Name) });

//jQuery autocomplete function
$('#searchTerm').autocomplete({
    minLength: 2,
    source: animalNames
});

//render initial table
updateDOM(jsonFile);