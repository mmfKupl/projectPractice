var GameCore = function(canvas, width, height) {
	this.canvas = canvas;
	this.width = width;
	this.height = height;
}

GameCore.prototype = {
	
	images: {},

	ctx: null,
	
	async init() {
		await this.setMainImage();
		console.log(this)
		this.ctx = this.canvas.getContext('2d');
		this.renderScene();
	},

	async setMainImage() {
		this.images['background'] = await this.setImage('/textures/background/sky.png');
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
	},

	renderScene() {
		this.drawImage(this.images.background);
		this.drawImage(this.images.ground, 0, this.height * 0.75, this.images.ground.width, this.images.ground.height);
		let turretDimensions = this.getTurretDimensions();
		this.drawImage(this.images.turret_body, turretDimensions._X, turretDimensions._Y, turretDimensions._WIDTH, turretDimensions._HEIGHT);
		this.renderBags();
	},

	renderBags() {
		const bagNumber = 5,
			y_cord = Math.floor(this.height * 0.868),
			w = this.images.bag.width * 0.8,
			h = this.images.bag.height * 0.8;
		let x_cord = -0.5 * w;
		for(let i = 0; i < bagNumber; i++) {
			this.drawImage(this.images.bag, x_cord, y_cord, w, h);
			x_cord += 0.7 * w;
		}
	},

	getTurretDimensions() {
		let t_body = this.images.turret_body,
			procent = this.width / this.height;
		return {
			_X: Math.floor(this.width * 0.05),
			_Y: Math.floor(this.height * 0.73),
			_WIDTH: Math.floor(t_body.width * procent),
			_HEIGHT: Math.floor(t_body.height * procent)
		}
	},

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
	},

	drawImage(img, x = 0, y = 0, w = this.width, h = this.height) {
		this.ctx.drawImage(img, x, y, w, h);
	},

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
	},

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
};

export default GameCore;