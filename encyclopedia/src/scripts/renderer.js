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
        let objVal = Object.values(record);

        for (let i = 0; i < objVal.length; i++) {
            listElement += `<td>${objVal[i]}</td>`;
        }

        listElement += '</tr>';
    });

    document.getElementById('record').innerHTML = listElement + '</tbody>';
}

let allCheckbox = ['dog', 'cat', 'male', 'female'];

for (let i = 0; i < allCheckbox.length; i++) {
    let itemCheck = document.getElementById(allCheckbox[i]);
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
    updateDOM(jsonFile)
});

//when the search button is clicked...
document.getElementById('search').addEventListener('click', () => {
    //filter items by animal type
    let val = document.getElementById('searchTerm').value.toLowerCase().split(' ');

    if (val[0] !== '') {
        let filtered = jsonFile.filter((animal) => {
            let searchRef =  Object.values(animal).map(a => a.toLowerCase());

            for (let u = 0; u < searchRef.length; u++) {
                let v = searchRef[u].split(' ')
                if (v.length > 1) v.forEach(w => searchRef.push(w));
            }

            return val ? val.every(b => Object.values(searchRef).includes(b)) : false;
        });

        updateDOM(filtered);
    }
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
//render initial table
updateDOM(jsonFile);

//autocomplete stuff
let c = new Array();
jsonFile.forEach(d => { if (!(c.includes(d.Animal_Name) || d.Animal_Name === 'Unknown')) c.push(d.Animal_Name) });

$('#searchTerm').autocomplete({
    minLength: 2,
    source: c
});