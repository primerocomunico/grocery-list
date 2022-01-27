// SELECT ITEMS
const alert = document.querySelector('#alert-banner');
const form = document.querySelector('.grocery-form');
const groceryItem = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

// edit options
let editElement;
let editFlag = false;
let editId = '';

// EVENT LISTENERS
// submit form
form.addEventListener('submit', addItem)
// clear button
clearBtn.addEventListener('click', clearItems);
// load items
window.addEventListener('DOMContentLoaded', setupItems);

// FUNCTIONS
// add Item to the list
function addItem(e) {
    e.preventDefault();
    const value = groceryItem.value;
    const id = new Date().getTime().toString();
    if (value && !editFlag) {
        createListItem(id, value);
        container.classList.add('show-container');
        displayAlert('new element has added', 'success');
        addLocalStorage(id, value);
        setBackDefault();
    } else if (value && editFlag) {
        editElement.innerHTML = value;
        displayAlert(`the ${groceryItem.value} has been edited`, 'success');
        editLocalStorage(editId, value);
        setBackDefault();
    } else {
        displayAlert('empty value is not allowed', 'danger');
    }
};

// clear the list items
function clearItems() {
    const items = document.querySelectorAll('.grocery-item');
    if (items.length > 0) {
        items.forEach((item) => {
            list.removeChild(item);
        })
    }
    container.classList.remove('show-container');
    clearLocalStorage();
    displayAlert('all items have been removed', 'danger');
    setBackDefault();
};

// edit item
function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    groceryItem.value = editElement.innerHTML;
    editFlag = true;
    editId = id;
    submitBtn.textContent = 'edit';
};

// delete item
function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if (list.children.length === 0) {
        container.classList.remove('show-container');
    }
    displayAlert(`${element.textContent} was deleted`, 'danger');
    removeLocalStorage(id);
    setBackDefault();
};

// display alert
function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    setTimeout(() => {
        alert.textContent = '';
        alert.classList.remove(`alert-${action}`);
    }, 2000);
};

// Set back to default
function setBackDefault() {
    groceryItem.value = '';
    editFlag = false;
    editId = '';
    submitBtn.textContent = 'submit';
};

// LOCAL STORAGE
function addLocalStorage(id, value) {
    let items = getLocalStorage();
    const groceryObj = { id, value };
    items.push(groceryObj);
    localStorage.setItem('list', JSON.stringify(items));
};

function removeLocalStorage(id) {
    let items = getLocalStorage();
    items = items.filter((item) => {
        if(item.id !== id) {
            return item;
        }
    });
    localStorage.setItem('list', JSON.stringify(items));
};

function editLocalStorage(editId, value) {
    let items = getLocalStorage();
    items = items.map((item) => {
        if(item.id === editId) {
            item.value = value;
        }
        return item;
    });
    localStorage.setItem('list', JSON.stringify(items));
};

function clearLocalStorage() {
    localStorage.removeItem('list');
};

function getLocalStorage() {
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
};

// SETUP ITEMS
function setupItems() {
    let items = getLocalStorage();
    if(items.length > 0) {
        items.forEach((item) => {
            createListItem(item.id, item.value);
        })
        container.classList.add('show-container');
    }
}

function createListItem(id, value) {
    const element = document.createElement('article');
    element.classList.add('grocery-item');
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `
        <span class="tittle">${value}</span>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>`;
    const editBtn = element.querySelector('.edit-btn');
    const deleteBtn = element.querySelector('.delete-btn');
    editBtn.addEventListener('click', editItem);
    deleteBtn.addEventListener('click', deleteItem);
    list.appendChild(element);
}