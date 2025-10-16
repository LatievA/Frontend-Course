// Get paragraph and button elements
let paragraph = document.getElementById("message");
let button = document.getElementById("changeBtn");

// Add click event listener to button
button.addEventListener("click", function() {
  paragraph.textContent = "The paragraph text has been changed!";
});

// Get elements
let box = document.getElementById("contentBox");
let bgBtn = document.getElementById("bgBtn");
let fontBtn = document.getElementById("fontBtn");

// Change background color on button click
bgBtn.addEventListener("click", function() {
  // Pick a random color
  const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  box.style.backgroundColor = randomColor;
});

// Change font size on button click
fontBtn.addEventListener("click", function() {
  // Pick a random font size between 14px and 30px
  const randomSize = Math.floor(Math.random() * 17) + 14;
  box.style.fontSize = randomSize + "px";
});

// Get references to buttons and list
let addBtn = document.getElementById("addBtn");
let removeBtn = document.getElementById("removeBtn");
let list = document.getElementById("itemList");

// Add new list item
addBtn.addEventListener("click", function() {
  let newItem = document.createElement("li");
  let itemCount = list.children.length + 1;
  newItem.textContent = "Item " + itemCount;
  list.appendChild(newItem);
});

// Remove the last list item
removeBtn.addEventListener("click", function() {
  if (list.lastElementChild) {
    list.removeChild(list.lastElementChild);
  } else {
    alert("No more items to remove!");
  }
});