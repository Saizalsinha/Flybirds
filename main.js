let carts = document.querySelectorAll('.add-cart');


let products = [{
    name: 'Item1',
    tag: 'fav-item1',
    price: 95,
    inCart: 0
  },
  {
    name: 'Item2',
    tag: 'fav-item2',
    price: 115,
    inCart: 0
  },
  {
    name: 'Item3',
    tag: 'fav-item3',
    price: 95,
    inCart: 0
  }
]

for (let i = 0; i < carts.length; i++) {
  carts[i].addEventListener('click', () => {
    cartNumbers(products[i]);
    totalCost(products[i]);
  })
}

function onLoadCartNumbers() {
  let productNumbers = localStorage.getItem('cartNumbers');
  if (productNumbers) {
    document.querySelector('.cart span').textContent = productNumbers;
  }
}

function cartNumbers(product) {
  let productNumbers = localStorage.getItem('cartNumbers');
  productNumbers = parseInt(productNumbers);
  if (productNumbers) {
    localStorage.setItem('cartNumbers', productNumbers + 1);
    document.querySelector('.cart span').textContent = productNumbers + 1;
  } else {
    localStorage.setItem('cartNumbers', 1);
    document.querySelector('.cart span').textContent = 1;
  }
  setItems(product);
}

function setItems(product) {
  let cartItems = localStorage.getItem('productsInCart');
  cartItems = JSON.parse(cartItems);
  if (cartItems != null) {
    if (cartItems[product.tag] == undefined) {
      cartItems = {
        ...cartItems,
        [product.tag]: product
      }
    }
    cartItems[product.tag].inCart += 1;
  } else {
    product.inCart = 1;
    cartItems = {
      [product.tag]: product
    }
  }

  localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

function totalCost(product) {
  let cartCost = localStorage.getItem('totalCost');
  if (cartCost != null) {
    cartCost = parseInt(cartCost);
    localStorage.setItem("totalCost", cartCost + product.price);
  } else {
    localStorage.setItem("totalCost", product.price);
  }
}

function displayCart() {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  let productContainer = document.querySelector(".products-container");
  let cartCost = localStorage.getItem('totalCost');
  if (cartItems && productContainer) {
    productContainer.innerHTML = '';
    Object.values(cartItems).map(item => {
      productContainer.innerHTML += `
        <div class="cart-items">
        <div class="product">
          <img class="prod-img" src="images/${item.tag}.png">
          <span class="item-name">${item.name}</span>
        </div>
        <div class="price-div">$${item.price}</div>
        <div class="quantity-div">
          <img class="minus" src="images/minus.png" onclick="deleteItems('${item.tag}')">
          <span class="quant">${item.inCart}</span>
          <img class="plus" src="images/plus.png" onclick="addItems('${item.tag}')">
        </div>

        <div class="cross-div">
            <img class="cross" onclick="crossItems('${item.tag}')" src="images/cross-sign.png">
        </div>
        <div class="line"></div>
        </div>

      `;
    });
    productContainer.innerHTML += `
    <div class="total-div">
       <h3 class="total-text">TOTAL</h3>
       <h3 class="total-cost">$${cartCost}</h3>
    </div>
    `;
  }
}

//for cart innerHTML
function crossItems(productTag){
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  for(let i = 0; i < cartItems[productTag].inCart; i++){
    deleteItems(productTag);
  }
}

function addItems(product){
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  cartNumbers(cartItems[product]);
  totalCost(cartItems[product]);

  onLoadCartNumbers();
  displayCart();
}

function deleteItems(productTag){
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  removeItems(cartItems[productTag]);

  let productNumbers = localStorage.getItem('cartNumbers');
  productNumbers = parseInt(productNumbers);
  if (productNumbers) {
    localStorage.setItem('cartNumbers', productNumbers - 1);
    document.querySelector('.cart span').textContent = productNumbers - 1;
  }
}

function removeItems(product){
  let cartItems = localStorage.getItem('productsInCart');
  cartItems = JSON.parse(cartItems);
  if (cartItems != null) {
    if (cartItems[product.tag] == undefined) {
      cartItems = {
        ...cartItems,
        [product.tag]: product
      }
    }
    //  console.log(cartItems[product.tag]);
    if(cartItems[product.tag].inCart == 1){
      delete cartItems[product.tag];
    }else
      cartItems[product.tag].inCart -= 1;
  } else {
    console.log("error occured");
  }

  localStorage.setItem("productsInCart", JSON.stringify(cartItems));

//change total cost
  let cartCost = localStorage.getItem('totalCost');
  if (cartCost != null) {
    cartCost = parseInt(cartCost);
    localStorage.setItem("totalCost", cartCost - product.price);
  }

  onLoadCartNumbers();
  displayCart();
}

onLoadCartNumbers();
displayCart();
