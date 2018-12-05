const HALF = 0.5;

class GameCore {
	constructor(m) {
		this.images = {};
		this.ctx = {};
		this.RADIANS = Math.PI/180;
		this.currentAngle = 0;
		this.fireFlag = false;
		this.bullets = [];
		this.enemys = [];
		this.bullet_speed = 1;
		this.enemys_speed = 1;
		this.timer_value = 0;
		this.temp_timer_value = 0;
		this.score = 0;
		this.upKeyFlag = false;
		this.curKey = '';
		this.curKeysX = [];
		this.curKeysY = [];
		this.movetimer = null;
	}

	async init(m, canvas, width, height, id) {
		this.userId = id;
		this.screen_relation = {
			W: 16 / width,
			H: 9 / height
		};
		this.canvas = canvas;
		this.width = width;
		this.height = height;
		this.x = 0;
		this.y = 0;
		this.GUN_DIM = {
			BODY_W: 1 / this.screen_relation.W,
			BODY_H: 1 / this.screen_relation.H,
			HEAD_W: 1 / this.screen_relation.W,
			HEAD_H: 0.5 / this.screen_relation.H,
			X: 1 / this.screen_relation.W,
			Y: 4.5 / this.screen_relation.H
		}

		this.BULLET_DIM = {
			W: 0.15 / this.screen_relation.W,
			H: 0.05 / this.screen_relation.H
		}

		this.ENEMY_DIM = {
			W: 1.5 / this.screen_relation.W,
			H: 0.8 / this.screen_relation.H
		}

		for (let el in this.GUN_DIM) {
			this.GUN_DIM[el] = Math.ceil(this.GUN_DIM[el])
		}
		for (let el in this.BULLET_DIM) {
			this.BULLET_DIM[el] = Math.ceil(this.BULLET_DIM[el])
		}
		for (let el in this.ENEMY_DIM) {
			this.ENEMY_DIM[el] = Math.ceil(this.ENEMY_DIM[el])
		}
		// this.ws = new WebSocket("ws://localhost:8999/");
		// this.ws.onopen = () => {
		// 	console.log('подключились');
		// }

		// this.ws.onclose = () => {
		// 	console.log('отключились');
		// }

		// this.ws.onmessage = (e) => {
		// 	this.confirmMessage(e.data);
		// }

		// this.ws.onerror = (e) => {
		// 	console.error(e)
		// }
		await this.setMainImage();
		this.ctx = this.canvas.getContext('2d');
		this.startTimer();
		this.renderScene();
	}

	startTimer() {
		this.timer_value++;
		setTimeout(() => {
			this.startTimer();
		}, 250);
	}

	async setMainImage() {
		this.images['background'] = await this.setImage('/textures/background/images.jpg');
		this.images['ground'] = await this.setImage('/textures/background/ground.png');

		this.images['turret_body'] = await this.setImage('/textures/turret/body.png');
		this.images['turret_gun'] = await this.setImage('/textures/turret/gun.png');
		this.images['turret_bullet'] = await this.setImage('/textures/turret/bullet.png');

		this.images['enemy1'] = await this.setImage('/textures/enemy/enemy1.png');
		this.images['enemy2'] = await this.setImage('/textures/enemy/enemy2.png');
		
		this.images['missile_easy'] = await this.setImage('/textures/enemy/missile/easyMissile.png');
		this.images['missile_medium'] = await this.setImage('/textures/enemy/missile/mediumMissile.png');
		this.images['missile_hard'] = await this.setImage('/textures/enemy/missile/hardMissile.png');

		this.images['bag'] = await this.setImage('/textures/bag.png');

		this.images['base'] = await this.setImage('/textures/base/base.png');
	}

	render() {

	}
	
	//useless
	correction (y, height) {
		let temp = (y / height) * 100;
		temp = y - temp;

		return Math.ceil(temp);
	}

	renderScore() {
		const x = 10, y = 30;
		this.ctx.font = "15pt Times New Roman";
		this.ctx.fillStyle = "#fff";
		this.ctx.fillText(`SCORE: ${this.score}`, x, y);
	}

	renderCrosshair() {
		const x = this.x + 0.5, y = this.y + 0.5, r = 10;
		this.ctx.beginPath();
		this.ctx.lineWidth = 2;
		this.ctx.strokeStyle = "#f00";
		this.ctx.arc(x, y, r, 0, 360);
		this.ctx.moveTo(x - r*1.5, y);
		this.ctx.lineTo(x + r*1.5, y);

		this.ctx.moveTo(x, y - r*1.5);
		this.ctx.lineTo(x, y + r*1.5);

		this.ctx.stroke();
	}

	renderScene() {
		this.initEnemy();
		let _x = this.GUN_DIM.X, _y = this.GUN_DIM.Y,
			_w_h = this.GUN_DIM.HEAD_W, _h_h = this.GUN_DIM.HEAD_H;
		// this.currentAngle = this.getAngle({x: this.MAIN_CORD.X, y: this.MAIN_CORD.Y}, {x: this.x,y: this.y});
		this.currentAngle = this.getAngle({ x: _x + 0.5 * _w_h, y: _y + 0.5 * _h_h }, { x: this.x, y: this.y });
		if(this.ctx.drawImage) {
			this.drawImage(this.images.background);
			this.ctx.fillStyle = "#000";
			this.ctx.fillRect(0, 0, this.width, this.height);
			this.renderGun();

			let body = this.images.turret_body;

			this.renderBullets();
			this.renderEnemys();
			this.hit();
			this.renderScore();
			this.renderCrosshair();
			this.drawAimLine();	
			this.ctx.fillText(this.currentAngle, 150, 150);
		}
		requestAnimationFrame(() => {
			// if(!this.bulletFlag) {
			this.renderScene();
			// }
		})
	}

	getAngle(center, point) {
		let w = point.x - center.x,
			h = - point.y + center.y;

		let A = Math.atan2(h, w) / this.RADIANS;
		A = (A < 0) ? A + 360 : A;

		return -A;
	}

	renderGun() {

		let _x = this.GUN_DIM.X, _y = this.GUN_DIM.Y,
			_w_b = this.GUN_DIM.BODY_W, _h_b = this.GUN_DIM.BODY_H,
			_w_h = this.GUN_DIM.HEAD_W, _h_h = this.GUN_DIM.HEAD_H,
			_angle = this.currentAngle;//this.getAngle({ x: _x + 0.5 * _w_h, y: _y + 0.5 * _h_h }, { x: this.x, y: this.y });

		//render gun body
		// this.ctx.fillStyle = "#00f";
		// this.ctx.fillRect(_x, _y, _w_b, _h_b);
		// this.ctx.strokeStyle = "#fff";
		// this.ctx.strokeRect(_x, _y, _w_b, _h_b);
		//
			
		// this.ctx.fillStyle = "rgba(256, 256, 256, .5)";
		// this.ctx.fillRect(_x, _y, _w_h, _h_h)
		this.drawRotateRect(_x + 0.5 * _w_h, _y + 0.5 * _h_h, _w_h, _h_h, _angle, "#0f0", true); // <-- current gun
	}

	drawRotateRect(x, y, w, h, angle, color, stroke = false) {
		this.ctx.save();
		this.ctx.translate(x, y);
		this.ctx.rotate(angle * this.RADIANS);
		if(stroke) {
			this.ctx.lineWidth = 2;
			this.ctx.strokeStyle = color;
			this.ctx.strokeRect(-w*0.5, -h*0.5, w, h);
		} else {
			this.ctx.fillStyle = color;
			this.ctx.fillRect(-w*0.5, -h*0.5, w, h);
		}
		// this.ctx.drawImage(image, -w*HALF, -h*HALF);
		this.ctx.restore();
	}

	drawRotateImage(image, x, y, w, h, angle) {
		this.ctx.save();
		this.ctx.translate(x, y);
		this.ctx.rotate(angle * this.RADIANS);
		this.ctx.drawImage(image, -w*HALF, -h*HALF);
		this.ctx.restore();
	}

	renderBags() {
		const bagNumber = 5,
			y_cord = Math.floor(this.height * 0.868),
			w = this.images.bag.width * 0.8,
			h = this.images.bag.height * 0.8;
		let x_cord = -HALF * w;
		for(let i = 0; i < bagNumber; i++) {
			this.drawImage(this.images.bag, x_cord, y_cord, w, h);
			x_cord += 0.7 * w;
		}
	}

	getTurretDimensions() {
		let t_body = this.images.turret_body,
			procent = this.width / this.height;
		return {
			_X: Math.floor(this.width * 0.05),
			_Y: Math.floor(this.height * 0.73),
			_WIDTH: Math.floor(t_body.width * procent),
			_HEIGHT: Math.floor(t_body.height * procent)
		}
	}

	setImage(url) {
		return new Promise((resolve, reject) => {
			let img = new Image();
			img.onload = () => {
				resolve(img);
			}
			img.onerror = err => {
				reject(err);
			}
			img.src = url;
		})
	}

	drawImage(img, x = 0, y = 0, w = this.width, h = this.height) {
		this.ctx.drawImage(img, x, y, w, h);
	}

	setBGImage() {
		this.getBase64(this.images)
			.then(res => {
				let bg = new Image(100, 100);
				bg.onload = function(){
				}
				bg.src = res;
				document.body.appendChild(bg)
				this.ctx.drawImage(bg, 0, 0, 100, 100);
			})
	}

	getBase64(file) {
		var reader = new FileReader();
		reader.readAsDataURL(file);
		return new Promise((resolve, reject) => {
			reader.onload = function () {
				resolve(reader.result);
			};
			reader.onerror = function (error) {
				reject(error);
			};
		})
	}

	setPosition(x = Number, y = Number) {
		// console.log(x, y);
		this.x = x;
		this.y = y;
		// this.ws.send(JSON.stringify({id: this.userId, x: this.x, y: this.y}));
		// requestAnimationFrame(() => {
		// 	if(!this.bulletFlag) {
		// 		this.renderScene();
		// 	}
		// })
	}

	confirmMessage(data = '{}') {
		data = JSON.parse(data);
		if(data.userId !== this.userId) {
		}
	}

	drawAimLine() {
		const _x = this.GUN_DIM.X, _y = this.GUN_DIM.Y;
		const x = Math.ceil(_x + this.GUN_DIM.HEAD_W*0.5) + HALF, y = Math.ceil(_y  + this.GUN_DIM.HEAD_H*0.5) + HALF;

		this.ctx.lineWidth = 0.5;
		this.ctx.beginPath();
		this.ctx.strokeStyle = '#00ff00';
		this.ctx.moveTo(x, y);
		this.ctx.lineTo(this.x, this.y);
		this.ctx.stroke();
		this.ctx.strokeStyle = '#fff';

		this.ctx.beginPath();
		this.ctx.moveTo(x, HALF);
		this.ctx.lineTo(x, this.height + HALF);
		this.ctx.stroke();

		this.ctx.beginPath();
		this.ctx.moveTo(this.x, HALF);
		this.ctx.lineTo(this.x, this.height + HALF);
		this.ctx.stroke();

		this.ctx.beginPath();
		this.ctx.moveTo(HALF, this.y);
		this.ctx.lineTo(this.width + HALF, this.y);
		this.ctx.stroke();

		this.ctx.beginPath();
		this.ctx.moveTo(HALF, y);
		this.ctx.lineTo(this.width + HALF, y);
		this.ctx.stroke();

		this.ctx.font="20px Times New Roman";
		this.ctx.fillStyle = '#fff';
		this.ctx.fillText( this.x + ', ' + this.y + ', ' + this.currentAngle, this.x, this.y);
		this.ctx.fillText( _x + ', ' + _y, _x, _y);
		this.ctx.file = 'black';
	}

	animate (draw, duration, angle = 1, flag = true) {
		let start = performance.now();
		let t = this;
		// isAviableToNewBullet = false;

		requestAnimationFrame(function animate(time, flag = true) {
			let timePassed = time - start;
			if(timePassed > duration) timePassed = duration;
			// if(4 * timePassed > duration && flag) {
			// 	flag = false;
			// 	isAviableToNewBullet = true;
			// }
			draw(timePassed, angle);
	  
			if(timePassed < duration) {
				requestAnimationFrame((t) => {
					animate(t, flag)
				});
		  	} else {
				t.bulletFlag = false;
			}
		});
	  }

	startFire() {
		this.fireFlag = true;
		this.fire();
	}

	fire() {
		
		let default_bullet = {
			x: this.GUN_DIM.X,
			y: this.GUN_DIM.Y,
			start_x: this.GUN_DIM.X,
			start_y: this.GUN_DIM.Y,
			angle: this.currentAngle,
			start: performance.now()
		};
		this.bullets.push(default_bullet);
		// if(this.fireFlag === true) {
		// 	console.log("currentAngle: " + this.currentAngle);
		// 	this.animate(this.renderBullet.bind(this), 3000, this.currentAngle + 50);
		// }
		// requestAnimationFrame(this.fire.bind(this));
		if(this.fireFlag) {
			setTimeout(() => {
				this.fire();
			}, 150);
		}
	}

	renderBullets() {
		const img = this.images.turret_bullet;
		this.bullets.forEach(bullet => {
			let x = bullet.x,
				y = bullet.y,
				w = this.BULLET_DIM.W,
				h = this.BULLET_DIM.H,
				angle = bullet.angle;
			// this.drawImage(img, x, y, w, h);
			// this.drawRotateImage(img, x, y, w, h, angle);
			this.drawRotateRect(x + 0.5 * this.GUN_DIM.HEAD_W, y + 0.5 * this.GUN_DIM.HEAD_H, w, h, angle, '#0ff', true);
		});
		this.recountBulletsCords();
	}

	recountBulletsCords() {
		const bullet_speed = this.bullet_speed;
		this.bullets = this.bullets.filter(bullet => {
			let time_now = performance.now();

			const x_start = bullet.start_x, y_start = bullet.start_y;
			let angl = -bullet.angle;
			let xc = ((angl <= 90 && angl >= 270)) ? time_now - bullet.start : bullet.start - time_now;
			let yc = (angl >= 0 && angl <= 180) ? time_now - bullet.start : bullet.start - time_now; 

			angl = Number((angl * this.RADIANS).toFixed(2));
			bullet.x = (xc) * bullet_speed + x_start;
			bullet.y = y_start - (yc) * bullet_speed * (Math.tan(angl));
			console.log(bullet.x, bullet.y) 

			return (bullet.x < this.width && bullet.x > 0) && (bullet.y > 0 && bullet.y < this.height);
		});
	}

	stopFire() {
		this.fireFlag = false;
	}

	initEnemy() {
		if(this.temp_timer_value !== this.timer_value) {
			const enemy_w = this.images.enemy1.width,
				enemy_h = this.images.enemy1.height;
			let default_enemy = {
				x: this.width + enemy_w,
				y: Math.random() * (this.height -3*this.ENEMY_DIM.H) + this.ENEMY_DIM.H,
				start: performance.now()
			}
			this.temp_timer_value = this.timer_value;
			this.enemys.push(default_enemy);
			if(Math.random()%2) {
				default_enemy = {
					x: this.width + enemy_w,
					y: Math.random() * (this.height - 3*this.ENEMY_DIM.H) + this.ENEMY_DIM.H,
					start: performance.now()
				}
				this.enemys.push(default_enemy);
			}
		}
	}

	renderEnemys() {
		const img = this.images.enemy1;

		this.enemys.forEach(enemy => {
			let x = enemy.x,
				y = enemy.y,
				w = this.ENEMY_DIM.W,
				h = this.ENEMY_DIM.H,
				angle = enemy.angle;
			// this.drawImage(img, x, y, w, h);
			
		this.ctx.fillStyle = "rgba(256, 256, 256, .5)";
			this.ctx.fillRect(x, y, w, h);
			// this.drawRotateImage(img, x, y, w, h, angle);
		});
		
		this.recountEnemysCords();
	}

	recountEnemysCords() {
		const speed = 0.5;
		this.enemys = this.enemys.filter(enemy => {
			let time_now = performance.now() * speed;
			
			enemy.x = this.width - (time_now - enemy.start);
			if(enemy.x > -this.images.enemy1.width) {
				return true;
			} else {
				this.score--;
				return false;
			}
		});
	}

	hit() {
		const emW = this.images.enemy1.width,
			emH = this.images.enemy1.height,
			blW = this.images.turret_bullet.width,
			blH = this.images.turret_bullet.height;

		for(let i = 0; i < this.enemys.length; i++) {
			for(let j = 0; j < this.bullets.length; j++) {
				let enemy = this.enemys[i],
					bullet = this.bullets[j];
				if( (
					enemy.x <= (bullet.x + blW) && 
					(enemy.x + emW) >= bullet.x
					) && 
					(
					(enemy.y + emH) >= bullet.y &&
					enemy.y <= (bullet.y + blH)
					)
				) {
					this.score++;
					enemy.delete = true;
					bullet.delete = true;
				}
			}
		}

		this.bullets = this.bullets.filter(el => !el.delete);
		this.enemys = this.enemys.filter(el => !el.delete);
	}

	moveGun() {
		let xk = this.curKeysX[0] || '', yk = this.curKeysY[0] || '';
		const step = 1.5;
		if(yk === 'w') {
			this.GUN_DIM.Y -= step;
		} else if(yk === 's') {
			this.GUN_DIM.Y += step;
		}
		if(xk === 'd') {
			this.GUN_DIM.X += step;
		} else if(xk === 'a') {
			this.GUN_DIM.X -= step;
		} 
		this.movetimer = setTimeout( () => {
			this.moveGun();
		}, 0);
		
	}

	isCurKey(key = '') {
		const arr = ['w', 'a', 's', 'd'];
		return arr.includes(key);
	}

	isCurKeyY(key = '') {
		const arr = ['w', 's'];
		return arr.includes(key);
	}

	isCurKeyX(key = '') {
		const arr = ['a', 'd'];
		return arr.includes(key);
	}

	onKeyDown(e) {
		console.log(this.curKeysX, this.curKeysY)
		let key = e.key;
		console.log()
		if( this.isCurKey(key) && !this.curKeysY.includes(key) && !this.curKeysX.includes(key) ) {
			if(this.isCurKeyX(key)) {
				this.curKeysX.unshift(key);
			} else {
				this.curKeysY.unshift(key);
			}
			clearTimeout(this.movetimer);
			this.curKey = e.key;
			this.moveGun();
		}
	}

	onKeyUp(e) {
		let key = e.key;
		if( this.isCurKey(key)) {
			if(this.isCurKeyX(key)) {
				const ind = this.curKeysX.findIndex(el => el === key);
				this.curKeysX.splice(ind, 1);
			} else {
				const ind = this.curKeysY.findIndex(el => el === key);
				this.curKeysY.splice(ind, 1);
			}
		}
	}

}

export default new GameCore('kek');