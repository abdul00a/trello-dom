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
    const cheitem =
      event.target.offsetParent.offsetParent.parentNode.parentNode
        .nextElementSibling.childNodes[1].childNodes[1].childNodes[1]
        .childNodes[7].children;
    getchecklist(id, cheitem);
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
               />
               <button class="waves-effect waves-light btn" data-type="checkListItem">Add
                 <i class="fa fa-plus-circle" aria-hidden="true"></i>
               </button>
               <div class="cancel-icon">
                 <i class="small material-icons" data-type="close_checkitems">cancel</i>
               </div>
              </div>
            </div>
          </div>
        </div>
           <div data-type="delete" class="del">
            <button class="waves-effect waves-light btn">Delete</button>
           </div>
          </div>
</div>`;
  checkListsContainer.insertAdjacentHTML('beforeend', addNewCheckList);
  return;
};

const creteCheckItem = (elem, id, values, state) => {
  let flag = '';
  if (state === 'complete') {
    flag = 'checked';
  }
  const items = `<div data-id=${id} class="box">
    <label class="box">
      <input type="checkbox" data-type="status" ${flag} />
      <span>${values}</span>
      </label>
      <i class="small material-icons" data-type="removeitem">cancel</i>
</div>`;

  elem.insertAdjacentHTML('beforeend', items);
  return;
};

const getchecklist = async (id, item) => {
  const url = ` https://api.trello.com/1/cards/${id}/checklists?checkItems=all&key=${apiKey}&token=${token}`;
  const response = await fetch(url);
  const JSONresponse = await response.json();
  JSONresponse.map(ele => {
    createCheckList(ele.name, ele.id);
    console.log(item);
    Array.from(item).forEach(checkEle => {
      if (checkEle.getAttribute('data-id') === ele.id) {
        ele.checkItems.map(create => {
          creteCheckItem(checkEle, create.id, create.name, create.state);
        });
      }
    });
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

  const checkLists = document.getElementById('newChecklist');
  checkLists.addEventListener('click', async event => {
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

  //add or remove checklist an checklist-items
  const checklistContainer = document.getElementById('allChecklist-container');
  checklistContainer.addEventListener('click', async event => {
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
    } else if (event.target.getAttribute('data-type') === 'checkListItem') {
      const id = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute(
        'data-id'
      );
      if (event.target.previousElementSibling.value === '') {
        alert('please enter checklist items name');
      } else {
        const url = `https://api.trello.com/1/checklists/${id}/checkItems?name=${event.target.previousElementSibling.value}&pos=bottom&checked=false&key=${apiKey}&token=${token}`;
        const response = await fetch(url, {
          method: 'POST'
        });
        const item = await response.json();
        const elem =
          event.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .parentNode;

        creteCheckItem(
          elem,
          item.id,
          event.target.previousElementSibling.value,
          item.state
        );
        event.target.previousElementSibling.value = '';
      }
    } else if (event.target.getAttribute('data-type') === 'removeitem') {
      console.log(event.target.parentNode.parentNode);
      const itemid = event.target.parentNode.getAttribute('data-id');
      const checklitsid = event.target.parentNode.parentNode.getAttribute(
        'data-id'
      );
      const url = `https://api.trello.com/1/checklists/${checklitsid}/checkItems/${itemid}?key=${apiKey}&token=${token}`;
      await fetch(url, {
        method: 'DELETE'
      });
      event.target.parentNode.remove();
    } else if (event.target.getAttribute('data-type') === 'status') {
      console.log(event.target);
      const idCheckItem = event.target.parentNode.parentNode.getAttribute(
        'data-id'
      );
      const cardid = event.target.offsetParent.id;
      let status = '';
      if (event.target.checked === true) {
        status = 'complete';
      } else {
        status = 'incomplete';
      }

      const url = `https://api.trello.com/1/cards/${cardid}/checkItem/${idCheckItem}?state=${status}&key=${apiKey}&token=${token}`;
      const response = await fetch(url, {
        method: 'PUT'
      });
      const result = await response.json();
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
    } else {
      const elems = document.querySelectorAll('.modal');
      M.Modal.init(elems);
    }
  });
};

document.addEventListener(' DOMContentLoaded', main());
