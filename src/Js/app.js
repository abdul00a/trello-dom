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
    <i class="tiny material-icons close-card">cancel</i>
  </div>
</li>`;
  const cardContainer = document.querySelector('#card-container');
  cardContainer.insertAdjacentHTML('beforeend', cards);
  createModal(value, id);
  return;
};

const createModal = (value, id) => {
  const modal = `<div id="${id}" class="modal">
  <div class="modal-content">
    <h4>${value}</h4>
    <p>A bunch of text</p>
  </div>
  <div class="modal-footer">
    <a href="#!" class="modal-close waves-effect waves-green btn-flat">Agree</a>
  </div>
</div>`;
  const modaContainer = document.querySelector('#modal-container');
  modaContainer.insertAdjacentHTML('beforeend', modal);
  return;
};

const main = () => {
  getCard();
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

  //create new card into list
  const newCard = document.getElementById('newCard');
  newCard.addEventListener('click', async () => {
    const text = document.querySelector('input');
    if (text.value === '') {
      alert('please insert card name');
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
    if (event.target.classList[2] === 'close-card') {
      const cardID = event.target.parentNode.parentNode.getAttribute('data-id');
      const url = `https://api.trello.com/1/cards/${cardID}?key=${apiKey}&token=${token}`;
      await fetch(url, {
        method: 'DELETE'
      });
      event.target.parentNode.parentNode.remove();
      event.stopPropagation();
      // return;
    } else if (event.target.classList[2] === 'cards') {
      const elems = document.querySelectorAll('.modal');
      M.Modal.init(elems);
      // event.stopPropagation();
    }
    console.log(event.target);
  });
};

document.addEventListener(' DOMContentLoaded', main());
