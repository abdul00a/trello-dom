const listId = '5e04e83d81bd402da4845f48';
const bordID = '5e049720a34d9831e53d4809';
const apiKey = 'c2e0d64a00afd5e936e54a2592a6ced9';
const token =
  '1ea6586d5a434c39ae8d31357ebaabfb1f497ce88b86421037b4dc2ff0da932e';

const getCard = async () => {
  const url = `https://api.trello.com/1/lists/${listId}/cards?key=${apiKey}&token=${token}`;
  const response = await fetch(url);
  const JSONresponse = response.json();
  JSONresponse.map(ele => {
    createcard(ele.name,ele.id);
  });
  console.log(JSONresponse);
};

const createcard = (value , id) => {
  const cards = `<li data-id="${id}">
  <div class="card small cards">
    ${value}
    <i class="tiny material-icons close-card">cancel</i>
  </div>
</li>`;
  const cardContainer = document.querySelector('#card-container');
    cardContainer.insertAdjacentHTML('beforeend', cards);
    return;
}

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
  
      createcard(text.value,card.id);
      text.value = '';
    }
  });

  //remove card from list
  const cardC = document.querySelector('#card-container');
  cardC.addEventListener('click', event => {
    // console.log(event.target.classList);
    if (event.target.classList[2] === 'close-card') {
      const cardID = event.target.parentNode.parentNode.getAttribute('data-id');
      let url = `https://api.trello.com/1/cards/${cardID}?key=${apiKey}&token=${token}`;
      await fetch(url, {
          method: 'DELETE'
      });
      event.target.parentNode.parentNode.remove();
    }
  });
};

// document.addEventListener(' DOMContentLoaded', main());
main();
