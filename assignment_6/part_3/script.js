// =======================
// Task 5: Mouse Events
// =======================
const colorBox = document.getElementById("colorBox");
const originalColor = colorBox.style.backgroundColor;

colorBox.addEventListener("mouseover", function() {
  colorBox.style.backgroundColor = "lightgreen";
});

colorBox.addEventListener("mouseout", function() {
  colorBox.style.backgroundColor = originalColor;
});

// =======================
// Task 6: Keyboard Events
// =======================
const textInput = document.getElementById("textInput");
const displayText = document.getElementById("displayText");

textInput.addEventListener("keyup", function() {
  displayText.textContent = textInput.value;
});

// =======================
// Task 7: Calculator
// =======================
const num1 = document.getElementById("num1");
const num2 = document.getElementById("num2");
const result = document.getElementById("result");

document.getElementById("addBtn").addEventListener("click", function() {
  result.textContent = "Result: " + (Number(num1.value) + Number(num2.value));
});

document.getElementById("subBtn").addEventListener("click", function() {
  result.textContent = "Result: " + (Number(num1.value) - Number(num2.value));
});

document.getElementById("mulBtn").addEventListener("click", function() {
  result.textContent = "Result: " + (Number(num1.value) * Number(num2.value));
});

document.getElementById("divBtn").addEventListener("click", function() {
  if (Number(num2.value) === 0) {
    result.textContent = "Result: Cannot divide by zero!";
  } else {
    result.textContent = "Result: " + (Number(num1.value) / Number(num2.value));
  }
});
