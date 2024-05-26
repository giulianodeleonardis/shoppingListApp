import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://publicshoppinglist-82d97-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "/");
const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

//Listening the button "Add to cart"
addButtonEl.addEventListener("click", function () {
    let inputValue = inputFieldEl.value;
    if(addButtonEl.innerText == "Add to cart") {

    if (inputValue == "") {
        alert("Introduzca un valor válido");
    } else {
        push(shoppingListInDB, inputValue);
        clearInputFieldEl();
    } 
    }
    else if (addButtonEl.innerText == "Modify") {
        if (inputValue == "") {
            alert("Introduzca un valor válido");
        } else {
            let text = document.getElementById("input-field");
            let shoppingList = document.getElementById("shopping-list");
            let button = document.getElementById("add-button");
            button.innerText = "Modify";
            button.style.backgroundColor = "Orange";
            text.value = newEl.textContent;
            let itemsArray = shoppingList.childNodes;
            for (let i = 0; i < itemsArray.length; i++) {
                let currentItem = itemsArray[i].innerHTML;
                if(currentItem == newEl.textContent) {
                    let a = "Changed";
                    shoppingList.childNodes[i].innerHTML = a;
                    
                }
                /*let currentItem = itemsArray[i];
                let currentItemID = currentItem[0];
                let currentItemValue = currentItem[1];
                appendItemToShoppingListEl(currentItem);*/
            }
            /*
            push(shoppingListInDB, inputValue);
            clearInputFieldEl();
            */
        }   
    }
})

//Listen for changes on DB
onValue(shoppingListInDB, function (snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());
        clearShoppingListEl();

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            let currentItemID = currentItem[0];
            let currentItemValue = currentItem[1];
            appendItemToShoppingListEl(currentItem);
        }
    } else {
        shoppingListEl.innerHTML = "No items here... yet";
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
    inputFieldEl.value = "";
}

//Function to add the items that are in the DB in the list and to manipulate the list
function appendItemToShoppingListEl(item) {
    let itemID = item[0];
    let itemValue = item[1];
    let newEl = document.createElement("li");
    newEl.textContent = itemValue;
    //To manipulate the items when the users doing clicks on them
    newEl.addEventListener("click", function () {
        let choice = prompt(newEl.textContent, "Borrar | Editar");
        switch (choice) {
            case "Borrar":
                let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
                remove(exactLocationOfItemInDB);
                break;
            case "Editar":
                let text = document.getElementById("input-field");
                let shoppingList = document.getElementById("shopping-list");
                let button = document.getElementById("add-button");
                button.innerText = "Modify";
                button.style.backgroundColor = "Orange";
                text.value = newEl.textContent;
                let itemsArray = shoppingList.childNodes;
                for (let i = 0; i < itemsArray.length; i++) {
                    let currentItem = itemsArray[i].innerHTML;
                    if(currentItem == newEl.textContent) {
                        let a = "Changed";
                        shoppingList.childNodes[i].innerHTML = a;
                        
                    }
                    /*let currentItem = itemsArray[i];
                    let currentItemID = currentItem[0];
                    let currentItemValue = currentItem[1];
                    appendItemToShoppingListEl(currentItem);*/
                }

                addButtonEl.addEventListener("click", function () {
                    let inputValue = inputFieldEl.value;
                    if (inputValue == "") {
                        alert("Introduzca un valor válido");
                    } else {
                        push(shoppingListInDB, inputValue);
                        let toEdit = document.getElementById(itemID);
                        toEdit.value = inputValue;
                        clearInputFieldEl();
                    }
                })
                break;
            default:
                // Handle the error
                break;
        }
    })
    shoppingListEl.append(newEl);
}