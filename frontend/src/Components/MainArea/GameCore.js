const HALF = 0.5;

class GameCore {
	constructor(m) {
		console.log(m);
		this.images = {};
		this.ctx = {};
		this.RADIANS = Math.PI/180;
		this.currentAngle = 0;
		this.fireFlag = false;
		this.bullets = [];
		this.enemys = [];
		this.bullet_speed = 0.5;
		this.enemys_speed = 1;
		this.timer_value = 0;
		this.temp_timer_value = 0;
	}

	async init(m, canvas, width, height, id) {
		console.log(id);
		this.userId = id;
		this.canvas = canvas;
		this.width = width;
		this.height = height;
		this.x = 0;
		this.y = 0;
		this.GUN_CORD = {
			X: 100,
			Y: this.correction(712,this.height) + 39
		};
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

	renderScene() {
		this.initEnemy();
		this.currentAngle = this.getAngle({x: 100, y: 659}, {x: this.x,y: this.y});
		if(this.ctx.drawImage) {
			this.drawImage(this.images.background);
			this.drawImage(this.images.ground, 0,this.height * 0.75, this.images.ground.width - 50, this.images.ground.height - 50);
			this.drawAimLine();
			// this.renderEnemy1();
			this.renderGun();

			let turretDimensions = this.getTurretDimensions();
			// this.drawImage(this.images.turret_body, turretDimensions._X, turretDimensions._Y, turretDimensions._WIDTH, turretDimensions._HEIGHT);
			let body = this.images.turret_body;
			this.drawImage(body, 40, (this.correction(784,this.height) + 39) - body.height, body.width, body.height);
			// this.fire();

			this.renderBags();
			this.renderBullets();
			this.renderEnemys();
			this.hit();

		}
		requestAnimationFrame(() => {
			// if(!this.bulletFlag) {
			this.renderScene();
			// }
		})
	}

	getAngle(center, point) {
		// let x = point.x - center.x,
		// 	y = point.y - center.y;
		let w = point.x - center.x,
			h = - point.y + center.y;
		// console.log(w, h,h/w, Math.atan(h/w));
		// console.log(Math.atan(h/w)/this.RADIANS);
		return (90 - Math.atan(h/w)/this.RADIANS);
		// if(x === 0) return (y > 0)? 180 : 0;

		// let a = Math.atan(y/x) * 180/Math.PI;

		// a = (x > 0)? a + 90 : a + 270;

		// return a - 50;
	}

	renderGun() {
		let gun = this.images.turret_gun,
			w = gun.width + HALF,
			h = gun.height + HALF,
			x = this.GUN_CORD.X, y = this.GUN_CORD.Y,
			angle = this.getAngle({ x: 100, y: 659 }, { x: this.x, y: this.y }) - 50;
		// this.currentAngle = angle;
		this.drawRotateImage(gun, x, y, w, h, angle)

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
					console.log('asdasd')
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
			console.log('HEY');
		}
	}

	drawAimLine() {
		const _x = this.GUN_CORD.X, _y = this.GUN_CORD.Y;
		const x = _x - 10 + HALF, y = _y - 10 + HALF;

		
		this.ctx.beginPath();
		this.ctx.strokeStyle = '#00ff00';
		this.ctx.moveTo(x, y);
		this.ctx.lineTo(this.x, this.y);
		this.ctx.stroke();
		this.ctx.strokeStyle = 'black';

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
			x: 100,
			y: 665,
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
			}, 300);
		}
	}

	renderBullets() {
		const img = this.images.turret_bullet;
		this.bullets.forEach(bullet => {
			let x = bullet.x,
				y = bullet.y,
				w = img.width,
				h = img.height,
				angle = bullet.angle;
			// this.drawImage(img, x, y, w, h);
			this.drawRotateImage(img, x, y, w, h, angle);
		});
		this.recountBulletsCords();
	}

	recountBulletsCords() {
		const bullet_speed = this.bullet_speed;
		this.bullets = this.bullets.filter(bullet => {
			let time_now = performance.now();
			const x_start = 100, y_start = 649;
			let angl = 90 - bullet.angle;
			angl = Number((angl*this.RADIANS).toFixed(2));
			bullet.x = (time_now - bullet.start)*bullet_speed + x_start;
			bullet.y = y_start - (time_now - bullet.start)*bullet_speed * (Math.tan(angl)) ; 

			return (bullet.x < this.width) && (bullet.y > 0);
		});
	}

	stopFire() {
		this.fireFlag = false;
	}

	renderBullet(timePassed, angle) {
		(timePassed < 0) && (timePassed = 0);
		let x = timePassed * 0.4 + 100,
			temp = (x - 100) * (90 - angle) * this.RADIANS,
			y = 659 - temp,
			bullet = this.images.turret_bullet,
			w = bullet.width,
			h = bullet.height;

		//console.log(timePassed, x.toFixed(0), y.toFixed(0));

		this.bulletFlag = true;
		// this.renderScene();
		this.drawRotateImage(bullet, x,y, w, h, angle);
		//console.log( "angle = [" + angle + "]" );

		// this.drawRotateImage(this.images.turret_bullet,x,y,this.getAngle(
		// 	{x: x, y: this.correction(y,this.height) + 39}, {x: this.x, y: this.y}) + 10
		// );
	}

	initEnemy() {
		if(this.temp_timer_value !== this.timer_value) {
			const enemy_w = this.images.enemy1.width,
				enemy_h = this.images.enemy1.height;
			let default_enemy = {
				x: this.width + enemy_w,
				//y: this.height * 0.5,
				y: Math.random() * (500 - 100) + 100,
				start: performance.now()
				//img: random img
				//hp
			}
			this.temp_timer_value = this.timer_value;
			console.log(default_enemy);
			this.enemys.push(default_enemy);
		}
	}

	renderEnemys() {
		const img = this.images.enemy1;

		this.enemys.forEach(enemy => {
			let x = enemy.x,
				y = enemy.y,
				w = img.width,
				h = img.height,
				angle = enemy.angle;
			this.drawImage(img, x, y, w, h);
			// this.drawRotateImage(img, x, y, w, h, angle);
		});
		
		this.recountEnemysCords();
	}

	recountEnemysCords() {
		const speed = 0.5;
		this.enemys = this.enemys.filter(enemy => {
			let time_now = performance.now() * speed;
			
			enemy.x = this.width - (time_now - enemy.start);

			return enemy.x > -this.images.enemy1.width;
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
					enemy.delete = true;
					bullet.delete = true;
				}
			}
		}

		this.bullets = this.bullets.filter(el => !el.delete);
		this.enemys = this.enemys.filter(el => !el.delete);
	}

}

export default new GameCore('kek');