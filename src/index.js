"use strict";

// Admin classes
import AdminPanelController from "./controller";
import AdminPanelTypes from "./types";
import AdminPanelSchema from "./schema";

//************************************************************************
// testing types
//************************************************************************
let shopTypes = new AdminPanelTypes();

shopTypes.declareType('string', () => {
  return document.createElement('input');
}, {
  classNames: ['shop-data-input', 'data-input'],
  beforeCreate: () => {
    console.log("Adding new input...");
  },
  afterCreate: stringType => {
    console.log("New input added!");
  },
  getData: renderer => {
    return renderer.querySelector('input').value;
  },
  setData: (data, renderer) => {
    renderer.querySelector('input').value = data;
  }
});

console.log(shopTypes.Types);

let nameInput = shopTypes.types['STRING'].createDOM();
let surrnameInput = shopTypes.types['STRING'].createDOM();
let lastnameInput = shopTypes.types['STRING'].createDOM();

initInputChangeHandler(nameInput);
initInputChangeHandler(surrnameInput);
initInputChangeHandler(lastnameInput);

function initInputChangeHandler(inputType) {
  inputType.dom_view.addEventListener('keyup', e => {
    if (inputType.value == inputType.getData()) {
      return;
    }

    inputType.value = inputType.getData();
    console.log(inputType.value);
  });
}
//************************************************************************

//************************************************************************
// testing schemas
//************************************************************************

//************************************************************************

document.addEventListener('DOMContentLoaded', () => {
  //************************************************************************
  // testing types
  //************************************************************************
  let $_main = document.querySelector('main');
  $_main.appendChild(nameInput.dom_view);
  $_main.appendChild(surrnameInput.dom_view);
  $_main.appendChild(lastnameInput.dom_view);
  nameInput.setData("Your name...");
  surrnameInput.setData("Your surrname...");
  lastnameInput.setData("Your lastname...");
  //************************************************************************

  // getting containers to admin panel controller
  let $_admin_container = document.getElementById('container');

  // initialization of admin panel
  let adminPanel = new AdminPanelController($_admin_container);

  console.log(adminPanel.Types);
});
