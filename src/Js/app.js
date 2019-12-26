const main = () => {
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
  newCard.addEventListener('click', () => {
    const text = document.querySelector('input');
    const cards = `<li>
    <div class="card small cards">
      ${text.value}
      <i class="tiny material-icons close-card">cancel</i>
    </div>
  </li>`;
    const cardContainer = document.querySelector('#card-container');
    if (text.value !== '') {
      cardContainer.insertAdjacentHTML('beforeend', cards);
      text.value = '';
    } else {
      alert('please insert card name');
    }
  });

  //remove card from list
  const cardC = document.querySelector('#card-container');
  cardC.addEventListener('click', event => {
    console.log(event.target.classList);
    if (event.target.classList[2] === 'close-card') {
      event.target.parentNode.parentNode.remove();
    }
  });
};

document.addEventListener(' DOMContentLoaded', main());
