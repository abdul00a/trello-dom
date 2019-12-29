const listId = '5e04e83d81bd402da4845f48';
const bordID = '5e049720a34d9831e53d4809';
const apiKey = 'c2e0d64a00afd5e936e54a2592a6ced9';
const token =
  '1ea6586d5a434c39ae8d31357ebaabfb1f497ce88b86421037b4dc2ff0da932e';

const getCard = async () => {
  const url = `https://api.trello.com/1/lists/${listId}/cards?key=${apiKey}&token=${token}`;
  const response = await fetch(url);
  const JSONresponse = await response.json();
  JSONresponse.map(ele => {
    createcard(ele.name, ele.id);
  });
};

const createcard = (value, id) => {
  const cards = `<li data-id="${id}" data-target="${id}" class="modal-trigger">
  <div class="card small cards">
    ${value}
    <i class="tiny material-icons close-card" data-type="deleteCard">cancel</i>
  </div>
</li>`;
  const cardContainer = document.querySelector('#card-container');
  cardContainer.insertAdjacentHTML('beforeend', cards);
  return;
};

const createModal = () => {
  const model = document.getElementById('modal1');
  const text = document.querySelector('h4');
  const li = document.querySelector('#card-container');
  li.addEventListener('click', event => {
    const del = document.getElementById('allChecklist-container');
    del.innerHTML = '';
    const id = event.target.parentNode.getAttribute('data-target');
    const val = event.target.firstChild.textContent;
    model.setAttribute('id', id);
    text.textContent = val;

    getchecklist(id);
  });
  return;
};

const createCheckList = (name, id) => {
  const checkListsContainer = document.getElementById('allChecklist-container');
  const addNewCheckList = `<div data-id=${id} class="oneChecklist">
  <div class="checlist-header">
           <div>
           <div class="checkListName">
            <i class="fa fa-check-square-o checklist-icon" aria-hidden="true"></i>
            <p class="head">${name}</p>
           </div>
          <div>
             <div>
                <button
                  class="btn waves-effect waves-light checklistItems"
                  type="submit"
                  name="action"
                  data-type="checkitems">
                  Add item
                </button>
             </div>
            <div class="addchecklistItems" data-type="additem"> 
             <div class="card small">
               <input
                 type="text"
                 placeholder="checklist Items"
                 id="checkListInputItem"
               />
               <button class="waves-effect waves-light btn" id="newChecklist">Add
                 <i class="fa fa-plus-circle" aria-hidden="true"></i>
               </button>
               <div class="cancel-icon">
                 <i class="small material-icons closeChecklistItems" data-type="close_checkitems">cancel</i>
               </div>
              </div>
            </div>
          </div>
        </div>
           <div data-type="delete" class="del">
            <button class="waves-effect waves-light btn">Delete
            </button>
           </div>
          </div>
</div>`;
  checkListsContainer.insertAdjacentHTML('beforeend', addNewCheckList);
  return;
};

const getchecklist = async id => {
  const url = ` https://api.trello.com/1/cards/${id}/checklists?checkItems=all&checkItem_fields=name%2CnameData%2Cpos%2Cstate&key=${apiKey}&token=${token}`;
  const response = await fetch(url);
  const JSONresponse = await response.json();
  JSONresponse.map(ele => {
    createCheckList(ele.name, ele.id);
  });
};

const main = () => {
  getCard();
  createModal();
  //display add new-card function
  const addbtn = document.querySelector('#btn-newCard');
  const addCard = document.querySelector('#addCard');
  addbtn.addEventListener('click', () => {
    addCard.style.display = 'block';
    addbtn.style.display = 'none';
  });

  //close new card div container
  const closeCard = document.getElementById('close');
  closeCard.addEventListener('click', () => {
    addCard.style.display = 'none';
    addbtn.style.display = 'block';
  });

  //display add new-checklist function
  const btn_checklist = document.querySelector('#btn-checklist');
  const addChecklist = document.querySelector('#addChecklist');
  btn_checklist.addEventListener('click', () => {
    addChecklist.style.display = 'block';
    btn_checklist.style.display = 'none';
  });

  //close new Checklist div container
  const closeChecklist = document.getElementById('close-tab');
  closeChecklist.addEventListener('click', () => {
    addChecklist.style.display = 'none';
    btn_checklist.style.display = 'block';
  });

  // create new check list header
  const checkLists = document.getElementById('newChecklist');
  checkLists.addEventListener('click', async event => {
    // console.log(event.target.offsetParent.offsetParent.id);
    const listName = document.getElementById('checkListInput');
    if (listName.value === '') {
      alert('please enter checklist name');
    } else {
      const cardId = event.target.offsetParent.offsetParent.id;
      const url = `https://api.trello.com/1/cards/${cardId}/checklists?name=${listName.value}&key=${apiKey}&token=${token}`;
      const response = await fetch(url, {
        method: 'POST'
      });
      const checklistData = await response.json();
      createCheckList(listName.value, checklistData.id);
      listName.value = '';
      addChecklist.style.display = 'none';
      btn_checklist.style.display = 'block';
    }
  });

  // remove checklist
  const deleteChecklist = document.getElementById('allChecklist-container');
  deleteChecklist.addEventListener('click', async event => {
    if (event.target.parentNode.getAttribute('data-type') === 'delete') {
      const checklistID = event.target.parentNode.parentNode.parentNode.getAttribute(
        'data-id'
      );
      const url = `https://api.trello.com/1/checklists/${checklistID}?key=${apiKey}&token=${token}`;
      await fetch(url, {
        method: 'DELETE'
      });
      event.target.parentNode.parentNode.parentNode.remove();
    } else if (event.target.getAttribute('data-type') === 'checkitems') {
      event.target.parentNode.nextElementSibling.style.display = 'block';
      event.target.style.display = 'none';
    } else if (event.target.getAttribute('data-type') === 'close_checkitems') {
      event.target.parentNode.parentNode.parentNode.style.display = 'none';
      event.target.parentNode.parentNode.parentNode.previousElementSibling.firstElementChild.style.display =
        'block';
    }
  });

  //create new card into list
  const newCard = document.getElementById('newCard');
  newCard.addEventListener('click', async () => {
    const text = document.querySelector('input');
    if (text.value === '') {
      alert('please enter card name');
    } else {
      const url = `https://api.trello.com/1/cards?name=${text.value}&idList=${listId}&keepFromSource=all&key=${apiKey}&token=${token}`;
      const response = await fetch(url, {
        method: 'POST'
      });
      const card = await response.json();

      createcard(text.value, card.id);
      text.value = '';
    }
  });

  //remove card from list
  const cardContainer = document.querySelector('#card-container');
  cardContainer.addEventListener('click', async event => {
    if (event.target.getAttribute('data-type') === 'deleteCard') {
      const cardID = event.target.parentNode.parentNode.getAttribute('data-id');
      const url = `https://api.trello.com/1/cards/${cardID}?key=${apiKey}&token=${token}`;
      await fetch(url, {
        method: 'DELETE'
      });
      event.target.parentNode.parentNode.remove();
      event.stopPropagation();
      // return;
    } else {
      const elems = document.querySelectorAll('.modal');
      M.Modal.init(elems);
    }
  });
};

document.addEventListener(' DOMContentLoaded', main());
