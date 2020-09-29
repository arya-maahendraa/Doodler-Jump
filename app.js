document.addEventListener('DOMContentLoaded', () => {
	const grid = document.querySelector('.grid');
	const doodler = document.createElement('div');
	let doodlerLeftSpace = 50;
	let startPoint = 150;
	let doodlerBottomSpace = startPoint;
	let isGameOver = false;
	let paltformCount = 5;
	let platforms = [];
	let upTimerId, downTimerId, leftTimeId, RightTimeId;
	let isJumping = true;
	let isGoingLeft = false;
	let isGoingRight = false;

	class Platform {
		constructor(newPlatBottom) {
			this.bottom = newPlatBottom;
			this.left = Math.random() * 315;
			this.visual = document.createElement('div');

			const visual = this.visual;
			visual.classList.add('platform');
			visual.style.left = this.left + 'px';
			visual.style.bottom = this.bottom + 'px';
			grid.appendChild(visual);
		}
	}

	const createDoodler = () => {
		doodler.classList.add('doodler');
		grid.appendChild(doodler);
		doodlerLeftSpace = platforms[0].left;
		doodler.style.left = doodlerLeftSpace + 'px';
		doodler.style.bottom = doodlerBottomSpace + 'px';
	};

	const createPlatform = () => {
		for (let i = 0; i < paltformCount; i++) {
			let platGap = 600 / paltformCount;
			let newPlatBottom = 100 + i * platGap;
			let newPlatform = new Platform(newPlatBottom);
			platforms.push(newPlatform);
		}
	};

	const movePlatforms = () => {
		if (doodlerBottomSpace > 200) {
			platforms.forEach((platform) => {
				platform.bottom -= 4;
				let visual = platform.visual;
				visual.style.bottom = platform.bottom + 'px';

				if (platform.bottom < 10) {
					let firstPlatform = platforms[0].visual;
					firstPlatform.classList.remove('platform');
               platforms.shift();
               
               let newPlatform = new Platform(600);
               platforms.push(newPlatform);
				}
			});
		}
	};

	const gameOver = () => {
		console.log('GAME OVER!!!');
		isGameOver = true;
		clearInterval(upTimerId);
		clearInterval(downTimerId);
		isGoingLeft = false;
		isGoingRight = false;
		clearInterval(leftTimeId);
		clearInterval(RightTimeId);
	};

	const fall = () => {
		clearInterval(upTimerId);
		isJumping = false;
		downTimerId = setInterval(() => {
			doodlerBottomSpace -= 10;
			doodler.style.bottom = doodlerBottomSpace + 'px';

			if (doodlerBottomSpace <= 0) {
				gameOver();
			}
			platforms.forEach((platform) => {
				if (
					doodlerBottomSpace >= platform.bottom &&
					doodlerBottomSpace <= platform.bottom + 15 &&
					doodlerLeftSpace + 60 >= platform.left &&
					doodlerLeftSpace <= platform.left + 60 &&
					!isJumping
				) {
					console.log('landed');
					startPoint = doodlerBottomSpace;
					jump();
				}
			});
		}, 30);
	};

	const jump = () => {
		clearInterval(downTimerId);
		isJumping = true;
		upTimerId = setInterval(() => {
			doodlerBottomSpace += 20;
			doodler.style.bottom = doodlerBottomSpace + 'px';

			if (doodlerBottomSpace > startPoint + 200) {
				fall();
			}
		}, 30);
	};

	const moveLeft = () => {
		isGoingLeft = true;
		if (isGoingRight) {
			clearInterval(RightTimeId);
			isGoingRight = false;
		}

		leftTimeId = setInterval(() => {
			if (doodlerLeftSpace >= 0) {
				doodlerLeftSpace -= 5;
				doodler.style.left = doodlerLeftSpace + 'px';
			}
		}, 30);
	};

	const moveRight = () => {
		isGoingRight = true;
		if (isGoingLeft) {
			clearInterval(leftTimeId);
			isGoingLeft = false;
		}

		RightTimeId = setInterval(() => {
			if (doodlerLeftSpace <= 340) {
				doodlerLeftSpace += 5;
				doodler.style.left = doodlerLeftSpace + 'px';
			}
		}, 30);
	};

	const moveStraight = () => {
		isGoingLeft = false;
		isGoingRight = false;
		clearInterval(leftTimeId);
		clearInterval(RightTimeId);
	};

	const control = (e) => {
		if (e.key === 'ArrowLeft') {
			moveLeft();
		} else if (e.key === 'ArrowRight') {
			moveRight();
		} else if (e.key === 'ArrowUp') {
			moveStraight();
		}
	};

	const start = () => {
		if (!isGameOver) {
			createPlatform();
			createDoodler();
			setInterval(movePlatforms, 30);
			jump();
			document.addEventListener('keyup', control);
		}
	};
	// attach to butotn
	start();
});
