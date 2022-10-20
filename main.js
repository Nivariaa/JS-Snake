const snakeHead = document.querySelector('#snake-head')
const food = document.querySelector('#food')
const gameContainer = document.querySelector('#game-container')
const mainMenu = document.querySelector('#main-menu')
const difficultyContainer = document.querySelector('#difficulty-container')
const difficultySelector = document.querySelector('#difficulty-selector')
const scoreContainer = document.querySelector('#score-container')
const results = document.querySelector('#results')
const INCREMENT = 25

let dirY
let score
let dirX
let foodX
let foodY
let segmentCounter = 0
let segments = []
let tryy
let canTurn = true
let difficulty
let interval
let speed

// sets all variables to default to prepare for a new game
const resetVariables = function () {
	removeDivs()

	segmentCounter = 0
	segments = [{obj: snakeHead, posX: 150, posY: 200, lastX: 125, LastY: 200}]
	segments[0].obj.style.marginTop = segments[0].posY + 'px'
	segments[0].obj.style.marginLeft = segments[0].posX + 'px'
	
	canTurn = true
	dirY = 0
	score = 0
	dirX = 1
	foodX = 0
	foodY = 0
}

// starts the game
const startGame = function () {
	resetVariables()

	gameContainer.style.visibility = 'visible'
	results.style.visibility = 'hidden'
	mainMenu.style.visibility = 'hidden'

	difficulty = difficultySelector.value

	if(difficulty == 'Game Journalist'){
		speed = 1
	}
	else if(difficulty == 'Easy'){
		speed = 5
	}
	else if(difficulty == 'Normal'){
		speed = 10
	}
	else{
		speed = 20
	}

	// give the snake some body segments to begin with
	growSnake()
	growSnake()
	growSnake()
	growSnake()

	generateFood()

	// initiate the game loop
	interval = setInterval(function(){
		update()

		if(checkCollisions()){
			gameContainer.style.visibility = 'hidden'
			results.style.visibility = 'visible'

			scoreContainer.innerText = score
			difficultyContainer.innerText = difficulty

			clearInterval(interval)
		}

		if(segments[0].posX == foodX && segments[0].posY == foodY){
			generateFood()
			growSnake()
			score ++
		}
	}, (1 / speed) * 1000)
}

// removes body divs of the snake
const removeDivs = function () {
	for(let i = 1; i < segments.length; i++){
		gameContainer.removeChild(segments[i].obj)
	}
}

const backToMenu = function () {
	results.style.visibility = 'hidden'
	mainMenu.style.visibility = 'visible'	
}

// generates a random number to give the food a random location within the bounds of the game
const randomNum = function () {
	return Math.floor(Math.random() * 20) * INCREMENT
}

// grows the snake by creating body divs
const growSnake = function () {
	segmentCounter ++

	let element = document.createElement('div')
	element.setAttribute('id', `segment${segmentCounter}`)
	element.setAttribute('class', 'segment')
	gameContainer.appendChild(element)
	element = document.querySelector(`#segment${segmentCounter}`)

	const lastSegmentPosX = segments[segments.length - 1].posX
	const lastSegmentPosY = segments[segments.length - 1].posY
	segments.push({obj: element, posX: lastSegmentPosX, posY: lastSegmentPosY, lastX: 0, LastY: 0})	
	segments[segments.length - 1].obj.style.marginTop = segments[segments.length - 1].posY + 'px'
	segments[segments.length - 1].obj.style.marginLeft = segments[segments.length - 1].posX + 'px'
}

// generates and picks a random location for the food
const generateFood = function () {
	let valid = false

	// this loop repeats as long as the new generated food location is occupied 
	// by the snake.
	while(!valid){
		let foundMatch = 0
		foodX = randomNum()
		foodY = randomNum()	
		
		for(let i = 0; i < segments.length; i++){
			if(segments[i].posX == foodX && segments[i].posY == foodY){
				foundMatch ++
			}
		}	

		if(foundMatch == 0){
			valid = true
		}
	}

	food.style.marginTop = foodY + 'px'
	food.style.marginLeft = foodX + 'px'	
}

// checks collisions
const checkCollisions = function () {

	//checks if the snake hits the edge of the screen
	if(segments[0].posX < 0 || segments[0].posX > 475){
		return true
	}
	if(segments[0].posY < 0 || segments[0].posY > 475){
		return true
	}

	// checks if the snake runs over one of its body segments
	for(let i = 1; i < segments.length; i++){
		if(segments[0].posX == segments[i].posX && segments[0].posY == segments[i].posY){
			return true
		}
	}

	return false
}

// updates the position of every segment of the snake
const update = function () {

	//moves the head of the snake and records its last position
	segments[0].lastX = segments[0].posX
	segments[0].lastY = segments[0].posY
	segments[0].posX += INCREMENT * dirX
	segments[0].posY += INCREMENT * dirY

	for(let i = 1; i < segments.length; i++){
		// each segment moves to the last position of the segment before it
		segments[i].lastX = segments[i].posX
		segments[i].lastY = segments[i].posY
		segments[i].posX = segments[i - 1].lastX
		segments[i].posY = segments[i - 1].lastY
		segments[i].obj.style.marginTop = segments[i].posY + 'px'
		segments[i].obj.style.marginLeft = segments[i].posX + 'px'
	}

	segments[0].obj.style.marginTop = segments[0].posY + 'px'
	segments[0].obj.style.marginLeft = segments[0].posX + 'px'
	
	canTurn = true
}

document.onkeypress = function(e){
	if(canTurn){
		switch(e.key){

			// The snake should not be able to change to 180 degrees of its current direction.
			// users can still do this though by pressing directional keys fast enough before the
			// snake moves.
			// The canTurn variable ensures that the user cannot change directions while it already
			// pressed a directional key, fixing the problem mentioned above.

			case 'w':
				if(dirY != 1){
					dirX = 0
					dirY = -1	
					canTurn = false			
				}
				break
			case 's':
				if(dirY != -1){
					dirX = 0
					dirY = 1
					canTurn = false
				}
				break
			case 'a':
				if(dirX != 1){
					dirY = 0
					dirX = -1	
					canTurn = false			
				}
				break
			case 'd':
				if(dirX != -1){
					dirY = 0
					dirX = 1	
					canTurn = false			
				}
				break
		}	
	}
}