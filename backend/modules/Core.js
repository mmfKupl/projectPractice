const fs = require('fs');

const Core = {
	getMainImage(callback) {
		fs.readFile('./textures/background/backgroundPNG.png', (err, img) => {
			let res = {
				status: ''
			}
			if(err) {
				res.status = 'error';
				res.error = err;
			} else {
				res.status = 'ok';
				res.data = img;
			}
			if(callback) callback(res);

		});
	}
}


module.exports = Core;