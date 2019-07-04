var colors = generateRandomColors(6);
var pickedColor = pickColor();

var messageDisplay = document.getElementById('message');
var colorDisplay = document.getElementById('colorDisplay');
var h1 = document.querySelector('h1');
var squares = document.querySelectorAll('.square');
var resetButton = document.querySelector('#reset');
var easyBtn = document.querySelector('#easyBtn');
var hardBtn = document.querySelector('#hardBtn');
var nrColors = 6;

init();
newGame(nrColors);

function init(){
    // add event listeners
    easyBtn.addEventListener('click', function(){
        easyBtn.classList.add('selected');
        hardBtn.classList.remove('selected');
        nrColors = 3;
        newGame();
    });
    hardBtn.addEventListener('click', function(){
        easyBtn.classList.remove('selected');
        hardBtn.classList.add('selected');
        nrColors = 6;
        newGame();
    });
    resetButton.addEventListener('click', function () {
        newGame();
    });
    
    for (var i = 0; i < squares.length; i++) {
        // add event listener
        squares[i].addEventListener('click', function () {
            var clickedColor = this.style.background;
    
            if (clickedColor === pickedColor) {
                messageDisplay.textContent = "Good job!";
                resetButton.textContent = "Play again";
                // set all squares to the picked color 
                changeColors(pickedColor);
    
            } else {
                messageDisplay.textContent = "Try again";
                this.style.background = "#232323";
            }
        });
    }
}

function newGame() {
    colors = generateRandomColors(nrColors);
    pickedColor = pickColor();

    colorDisplay.textContent = pickedColor;
    for (var i = 0; i < squares.length; i++) {
        if (colors[i]) {
            squares[i].style.display = 'block';
            squares[i].style.background = colors[i];
        } else {
            squares[i].style.display = 'none';
        }


    }
    messageDisplay.textContent = "";
    resetButton.textContent = "New colors";
    h1.style.background = "steelblue";
}
function changeColors(color) {
    h1.style.background = color;
    for (var i = 0; i < squares.length; i++) {
        squares[i].style.background = color;
    }
}
function randomColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}
function pickColor() {
    var randomNumber = Math.floor(Math.random() * colors.length);

    return colors[randomNumber];
}
function generateRandomColors(nrColors) {
    var arrColors = [];
    for (var i = 0; i < nrColors; i++) {
        arrColors.push(randomColor());
    }
    return arrColors;
}