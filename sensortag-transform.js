module.exports = function(RED) {
	RED.nodes.registerType("sensortag-xform", transform);
	
	function transform(n) {
		RED.nodes.createNode(this,n);
		var node = this;

		node.on('input', function(msg) {
			var macUtil = require('getmac');
			macUtil.getMac(function(err, macAddress) {
                        	if (err) throw err;
                        	var macAdd = macAddress.replace(/:/gi, '');
				try {
					
					json = createJson(msg, macAdd);
					msg.payload = JSON.stringify(json)
					node.send(msg);
				}
				catch(err) {
					console.log(err);
				}
			});

		});
	}
	
	function createJson(msg, macAdd) {
		var data ={};
		data.json_data = {};
		var sensorId = 0;
		topic = msg.topic.split("/")[1];
		if( topic == "temperature" ) {
			data.json_data.ambient = msg.payload.ambient;
			data.json_data.target = msg.payload.object;
			sensorId = 1;
		}
		else if( topic == "humidity" ) {
			data.json_data.ambient = msg.payload.temp;
			data.json_data.rel_humidity = msg.payload.humidity;
			sensorId = 2;
		}
		else if ( topic == "pressure" ) {
			data.json_data.pressure = msg.payload.pres;
			sensorId = 3;
		}
		else if( topic == "accelerometer" ) {
			data.json_data.accel_x = msg.payload.x;
			data.json_data.accel_y = msg.payload.y;
			data.json_data.accel_z = msg.payload.z;
			sensorId = 4;
		}
		else if( topic == "magnetometer" ) {
			data.json_data.mag_x = msg.payload.x;
			data.json_data.mag_y = msg.payload.y;
			data.json_data.mag_z = msg.payload.z;
			sensorId = 5;
		}
		else if( topic == "gyroscope" ) {
			data.json_data.gyro_x = msg.payload.x;
			data.json_data.gyro_y = msg.payload.y;
			data.json_data.gyro_z = msg.payload.z;
			sensorId = 6;
		}
		else if( topic = "luxometer" ) {
			data.json_data.lux = msg.payload.lux
			sensorId = 6;
		}
		else {
		}

		data.id = macAdd + "." + msg.uuid + "." + sensorId;
		data.tstamp = getTimeStamp();
		return data;
	}
	
	function getTimeStamp() {
		now = new Date();
                date = formatNum(now.getDate());
                month = formatNum(now.getMonth() + 1);
                hours = formatNum(now.getHours());
                minutes = formatNum(now.getMinutes());
                seconds = formatNum(now.getSeconds());

                tstamp = now.getFullYear() + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + ".00000";
                return tstamp;
	}

	function formatNum(num) {
		if(num < 10) {
			num = "0" + num;
		}
		return num;
	}
}	
