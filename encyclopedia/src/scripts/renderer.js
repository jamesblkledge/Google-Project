'use strict'

//importing the filesystem module
let fs = require('fs');

//reading the json file
let jsonFile = JSON.parse(fs.readFileSync('./pets.json', 'utf8'));

//object that will store all filters
let filters = { animal_type: [], Animal_Gender: [], Animal_Breed: [], Animal_Color: [] }

//returns an array with all the filtered items
let animalFilter = (filterList) => {
    //filter jsonFile, returns an array with new values
    return jsonFile.filter((animalRecord) => {
        //for every filter in filterList, return either true/ false
        return Object.keys(filterList).every((key) => {
            //if each key in filterList is empty, return true, otherwise return true/ false if filter is found in main JSON file
            return !filterList[key].length ? true : filterList[key].includes(animalRecord[key].toLowerCase())
        });
    });
}

let updateDOM = (data) => {
    let listElement = `
        <tr>
            <th>Animal ID</th>
            <th>Animal Name</th>
            <th>Animal Type</th>
            <th>Animal Gender</th>
            <th>Animal Breed</th>
            <th>Animal Color</th>
            <th>Address</th>
        </tr>
        <tr>
    `;

    data.forEach((record) => {
        let objVal = Object.values(record);

        for (let i = 0; i < objVal.length; i++) {
            listElement += `<td>${objVal[i]}</td>`;
        }

        listElement += '</tr>';
    });

    document.getElementById('record').innerHTML = listElement;
}

let allCheckbox = document.querySelectorAll('input[type=checkbox]');

for (let i = 0; i < allCheckbox.length; i++) {
    let itemCheck = document.getElementById(allCheckbox[i].id);
    let objSelectorCheck = i < 2 ? 'animal_type' : 'Animal_Gender';

    let listCheck = filters[objSelectorCheck];

    itemCheck.addEventListener('change', () => {
        itemCheck.checked ? listCheck.push(itemCheck.value) : listCheck.splice(listCheck.indexOf(itemCheck) - 1, 1);
        let passThroughCheck = animalFilter(filters);
        updateDOM(passThroughCheck);
    });
}

let allSelect = document.querySelectorAll('select');

for (let j = 0; j < allSelect.length; j++) {
    let itemSelec = document.getElementById(allSelect[j].id);
    let objSelectorSelec = j == 0 ? 'Animal_Breed' : 'Animal_Color';

    let listSelec = filters[objSelectorSelec]

    itemSelec.addEventListener('change', () => {
        !(itemSelec.value === '') ? listSelec[0] = itemSelec.value : listSelec.pop();
        let passThroughSelec = animalFilter(filters);
        updateDOM(passThroughSelec);
    });
}


$('#searchTerm').autocomplete({
    source: ['Cat', 'Dog', 'Dead Cat', 'Dead Dog']
});

//when the search button is clicked...
document.getElementById('search').addEventListener('click', () => {
    //filter items by animal type
    let filtered = jsonFile.filter((animal) => {
        let val = document.getElementById('searchTerm').value.toLowerCase();

        return val ? animal.animal_type.toLowerCase() === val : false;
    });

    updateDOM(filtered);
});

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

updateDOM(jsonFile);