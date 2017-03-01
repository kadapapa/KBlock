// KADAPAPA.js

(function(ext) {
    var device = null;
    var _rxBuf = [];
    // Sensor states:
    var ports = {
        Port1: 1,
        Port2: 2,
        Port3: 3,
        Port4: 4,
        Port5: 5,
        Port6: 6,
        Port7: 7,
        Port8: 8,
		M1:9,
		M2:10,
		Port11: 11,
		Port12: 12,
		"led on board":13,
    };
	var slots = {
		Slot1:1,
		Slot2:2
	};
	var levels = {
		"HIGH":1,
		"LOW":0
	};
	var switchStatus = {
		"On":1,
		"Off":0
	};
	var humiture = {
		"humidity":1,
		"temperature":2
	};
	var rgbindexs = {
		"All":0,"First":1,"Second":2,"Third":3,"Fourth":4,
	};
	var colorvalue = {
		"black":0,"red":63488,"green":2016,"blue":31,"yellow":65504,"purple":63519,"cyan":2047,"white":65535,
	};
	var avalue = {
		"top":1,"bottom":3,"left":4,"right":2,
	};   
	var keyvalue =  {
		"key1":68,"key2":76,"key3":84,"key4":92,
	};
	var tkeyvalue = {
		"k1":1,"k2":2,"k3":3,"k4":4,"k5":5,"k6":6,"k7":7,"k8":8,"k9":9,"k10":10,"k11":11,"k12":12,
	}
	var actionvalue = {
		"Rfid_start":1,"Rfid_execute":2,"Rfid_forward":3,"Rfid_backwards":4,"Rfid_left":5,"Rfid_right":6,"Rfid_stop":7,
		"Rfid_clear":8,"Rfid_red":9,"Rfid_green":10,"Rfid_blue":11,"Rfid_yellow":12,"Rfid_delay1":13,"Rfid_delay2":14,
		"Rfid_delay5":15,"Rfid_buzzer":16,"Rfid_IR":17,"Rfid_ultrasonic":18,
	}
	var tones ={
		"B0":31,  "C1":33,  "D1":37,  "E1":41,  "F1":44,  "G1":49,  "A1":55,
		"B1":62,  "C2":65,  "D2":73,  "E2":82,  "F2":87,  "G2":98,  "A2":110,
		"B2":123, "C3":131, "D3":147, "E3":165, "F3":175, "G3":196, "A3":220,
		"B3":247, "C4":262, "D4":294, "E4":330, "F4":349, "G4":392, "A4":440,
		"B4":494, "C5":523, "D5":587, "E5":659, "F5":698, "G5":784, "A5":880,
		"B5":988, "C6":1047,"D6":1175,"E6":1319,"F6":1397,"G6":1568,"A6":1760,
		"B6":1976,"C7":2093,"D7":2349,"E7":2637,"F7":2794,"G7":3136,"A7":3520,
		"B7":3951,"C8":4186,"D8":4699
	};
	var beats = {
		"Half":500,"Quater":250,"Eighth":125,"Whole":1000,"Double":2000,"Zero":0
	};
	var ircodes = {
		"A":69,"B":70,"C":71,"D":68,"E":67,"F":13,"↑":64,"↓":25,"←":7,"→":9,"Setting":21,
		"R0":22,"R1":12,"R2":24,"R3":94,"R4":8,"R5":28,"R6":90,"R7":66,"R8":82,"R9":74
	};
	var axis = {
		'X-Axis':1,'Y-Axis':2,'Z-Axis':3
	}
    var inputs = {
        slider: 0,
        light: 0,
        sound: 0,
        button: 0,
        'resistance-A': 0,
        'resistance-B': 0,
        'resistance-C': 0,
        'resistance-D': 0
    };
	var values = {
		
	};
	var runServoDict = {
		
	};
	var indexs = [];
	var startTimer = 0;
	var versionIndex = 0xFA;

    ext.resetAll = function(){
    	device.send([0xff, 0x55, 2, 0, 4]);
    };
	ext.runArduino = function(){
		
	};
	ext.runWdigital = function(port,status){
		if(typeof port=="string"){
			port = ports[port];
		}
		if(typeof status=="string"){
			status = levels[status];
		}
		runPackage(30,port,status);
	};
	ext.runPwm = function(port,pwmvalue){
		if(typeof port=="string"){
			port = ports[port];
		}
		runPackage(32,port,pwmvalue);
	};
	ext.runLed = function(port,status){
		if(typeof port=="string"){
			port = ports[port];
		}
		if(typeof status=="string"){
			status = switchStatus[status];
		}
		runPackage(101,port,status);
	};
	ext.runVibrator = function(port,status){
		if(typeof port=="string"){
			port = ports[port];
		}
		if(typeof status=="string"){
			status = switchStatus[status];
		}
		runPackage(102,port,status);
	};
	ext.runMotor = function(port,speed) {
		if(typeof port=="string"){
			port = ports[port];
		}
/*		
		if(port == 9){
			speed = -speed;
		}
*/		
        runPackage(10,port,short2array(speed));
    };
    ext.runServo = function(port,angle) {
		if(typeof port=="string"){
			port = ports[port];
		}
        runPackage(11,port,angle);
    };   
	ext.runBuzzer = function(tone, beat){
		if(typeof tone == "string"){
			tone = tones[tone];
		}
		if(typeof beat == "string"){
			beat = parseInt(beat) || beats[beat];
		}
		runPackage(34,short2array(tone), short2array(beat));
	};
	ext.stopBuzzer = function(){
		runPackage(34,short2array(0));
	};	
	ext.runDigition = function(port,display){
		if(typeof port=="string"){
			port = ports[port];
		}
		runPackage(9,port,float2array(display));
	};
	ext.runRGB = function(port,rgbindex,color){
		if(typeof port=="string"){
			port = ports[port];
		}
		if(typeof rgbindex=="string"){
			rgbindex = rgbindexs[rgbindex];
		}
		if(typeof color=="string"){
			color = colorvalue[color];
		}
		var red    = (color >> 11) & 0x1f;
		var green  = (color >> 5) & 0x1f;
		var blue   = color & 0x1f;
		runPackage(8,port,rgbindex,red,green,blue);
	};
	ext.runLightSensor = function(port,status){
		if(typeof port=="string"){
			port = ports[port];
		}
		if(typeof status=="string"){
			status = switchStatus[status];
		}
		runPackage(3,port,status);
	};
	ext.runShutter = function(port,status){
		runPackage(20,shutterStatus[status]);
	};
	ext.runIR = function(message){
		runPackage(13,string2array(message));
	};
	ext.showCharacters = function(port,x,y,message){
		if(typeof port=="string"){
			port = ports[port];
		}
		message = message.toString();
		runPackage(41,port,1,6,3,short2array(x),short2array(7-y),message.length,string2array(message));
	}
	ext.showTime = function(port,hour,point,min){
		if(typeof port=="string"){
			port = ports[port];
		}
		runPackage(41,port,3,6,point==":"?1:0,short2array(hour),short2array(min));
	}
	ext.showDraw = function(port,x,y,bytes){
		if(typeof port=="string"){
			port = ports[port];
		}
		runPackage(41,port,2,6,bytes.length,short2array(x),short2array(y),bytes.length,bytes);
	}
	ext.resetTimer = function(){
		startTimer = (new Date().getTime())/1000.0;
	};
/////////////////////////////////////////////////////////////////	
	ext.getAnalog = function(nextID,port){
    	var deviceId = 31;
		if(typeof port=="string"){
			port = ports[port];
		}
		getPackage(nextID,deviceId,port);
    };
	ext.getPotentiometer = function(nextID,port) {
		var deviceId = 4;
		if(typeof port=="string"){
			port = ports[port];
		}
		getPackage(nextID,deviceId,port);
    };
	ext.getLightSensor = function(nextID,port) {
		var deviceId = 3;
		if(typeof port=="string"){
			port = ports[port];
		}
		getPackage(nextID,deviceId,port);
    };
	ext.getSoundSensor = function(nextID,port) {
		var deviceId = 7;
		if(typeof port=="string"){
			port = ports[port];
		}
		getPackage(nextID,deviceId,port);
    };	
    ext.getGasSensor = function(nextID,port){
    	var deviceId = 25;
		if(typeof port=="string"){
			port = ports[port];
		}
		getPackage(nextID,deviceId,port);
    };
	ext.getFlameSensor = function(nextID,port){
    	var deviceId = 24;
		if(typeof port=="string"){
			port = ports[port];
		}
		getPackage(nextID,deviceId,port);
    };
	ext.getTVOCSensor = function(nextID,port){
    	var deviceId = 106;
		if(typeof port=="string"){
			port = ports[port];
		}
		getPackage(nextID,deviceId,port);
    };
	ext.getShake = function(nextID,port) {
		var deviceId = 103;
		if(typeof port=="string"){
			port = ports[port];
		}
		getPackage(nextID,deviceId,port);
    };	
	ext.getTemperature = function(nextID,port) {
		var deviceId = 2;
		if(typeof port=="string"){
			port = ports[port];
		}
		getPackage(nextID,deviceId,port);
    };	
	ext.getHumidity = function(nextID,port) {
		var deviceId = 105;
		if(typeof port=="string"){
			port = ports[port];
		}
		getPackage(nextID,deviceId,port);
    };
    ext.getHumiture = function(nextID,port,valueType){
    	var deviceId = 23;
		if(typeof port=="string"){
			port = ports[port];
		}
		if(typeof valueType=="string"){			
			valueType = humiture[valueType];
		}
		getPackage(nextID,deviceId,port,valueType);
    };
	ext.getInfrared = function(nextID,port) {
		var deviceId = 16;
		if(typeof port=="string"){
			port = ports[port];
		}
		getPackage(nextID,deviceId,port);
    };
	ext.getUltrasonic = function(nextID,port){
		var deviceId = 1;
		if(typeof port=="string"){
			port = ports[port];
		}
		getPackage(nextID,deviceId,port);
	};
    ext.getGyro = function(nextID,ax,port) {
		var deviceId = 6;
		if(typeof ax=="string"){
			ax = axis[ax];
		}
		getPackage(nextID,deviceId,0,ax);
    };
	ext.getTimer = function(nextID){
		if(startTimer==0){
			startTimer = (new Date().getTime())/1000.0;
		}
		responseValue(nextID,(new Date().getTime())/1000.0-startTimer);
	}	
	ext.getDigital = function(nextID,port){
    	var deviceId = 30;
		if(typeof port=="string"){
			port = ports[port];
		}
		getPackage(nextID,deviceId,port);
    };	
	ext.getLinefollower = function(nextID,port) {
		var deviceId = 17;
		if(typeof port=="string"){
			port = ports[port];
		}
		getPackage(nextID,deviceId,port);
    };
	ext.getLimitswitch = function(nextID,port,slot) {
		var deviceId = 21;
		if(typeof port=="string"){
			port = ports[port];
		}
		getPackage(nextID,deviceId,port);
    };	
    ext.getButtonswitch = function(nextID,port){
    	var deviceId = 22;
		if(typeof port=="string"){
			port = ports[port];
		}
		getPackage(nextID,deviceId,port);
    };
    ext.getFourkey = function(nextID,key,port){
    	var deviceId = 104;
		if(typeof port=="string"){
			port = ports[port];
		}
		if(typeof key=="string"){
			key = keyvalue[key];
		}
		getPackage(nextID,deviceId,port,key);
    };
	ext.getIrRemote = function(nextID,code,port){
		var deviceId = 14;
		if(typeof code=="string"){
			code = ircodes[code];
		}
		getPackage(nextID,deviceId,0,code,port);
	}	
	ext.getPirmotion = function(nextID,port) {
		var deviceId = 15;
		if(typeof port=="string"){
			port = ports[port];
		}
		getPackage(nextID,deviceId,port);
    };
	ext.getTouchkey = function(nextID,key,port) {
    	var deviceId = 105;
		if(typeof port=="string"){
			port = ports[port];
		}
		if(typeof key=="string"){
			key = tkeyvalue[key];
		}
		getPackage(nextID,deviceId,port,key);
    };
	ext.getRFID = function(nextID,action) {
    	var deviceId = 110;
		if(typeof action=="string"){
			action = actionvalue[action];
		}
		getPackage(nextID,deviceId,2,action);
    };
/////////////////////////////////////////////////////////	
	ext.runFillScreen = function(color){
		if(typeof color=="string"){
			color = colorvalue[color];
		}
		runPackage(201,0,short2array(color));
	};
	ext.runDrawLine = function(x0,y0,x1,y1,color){
		if(typeof color=="string"){
			color = colorvalue[color];
		}
		runPackage(202,0,short2array(x0),short2array(y0),short2array(x1),short2array(y1),short2array(color));
	};
	ext.runDrawRect = function(x0,y0,w,h,color){
		if(typeof color=="string"){
			color = colorvalue[color];
		}
		runPackage(203,0,short2array(x0),short2array(y0),short2array(w),short2array(h),short2array(color));
	};
	ext.runDrawCircle = function(x0,y0,r,color){
		if(typeof color=="string"){
			color = colorvalue[color];
		}
		runPackage(204,0,short2array(x0),short2array(y0),short2array(r),short2array(color));
	};
	ext.runDrawTriangle = function(x0,y0,x1,y1,x2,y2,color){
		if(typeof color=="string"){
			color = colorvalue[color];
		}
		runPackage(205,0,short2array(x0),short2array(y0),short2array(x1),short2array(y1),short2array(x2),short2array(y2),short2array(color));
	};
	ext.runFillRect = function(x0,y0,w,h,color){
		if(typeof color=="string"){
			color = colorvalue[color];
		}
		runPackage(206,0,short2array(x0),short2array(y0),short2array(w),short2array(h),short2array(color));
	};
	ext.runFillCircle = function(x0,y0,r,color){
		if(typeof color=="string"){
			color = colorvalue[color];
		}
		runPackage(207,0,short2array(x0),short2array(y0),short2array(r),short2array(color));
	};
	ext.runFillTriangle = function(x0,y0,x1,y1,x2,y2,color){
		if(typeof color=="string"){
			color = colorvalue[color];
		}
		runPackage(208,0,short2array(x0),short2array(y0),short2array(x1),short2array(y1),short2array(x2),short2array(y2),short2array(color));
	};
	ext.runDrawChar = function(x0,y0,size,color,bgcolor,c){
		if(typeof color=="string"){
			color = colorvalue[color];
		}
		if(typeof bgcolor=="string"){
			bgcolor = colorvalue[bgcolor];
		}
		runPackage(209,0,short2array(x0),short2array(y0),size,short2array(color),short2array(bgcolor),c);
	};
	ext.runText = function(x0,y0,size,color,bgcolor,s){
		if(typeof color=="string"){
			color = colorvalue[color];
		}
		if(typeof bgcolor=="string"){
			bgcolor = colorvalue[bgcolor];
		}
		runPackage(210,0,short2array(x0),short2array(y0),size,short2array(color),short2array(bgcolor),string2array(s));
	};
	ext.runInvertDisplay = function(){

		runPackage(212,0);
	};
	ext.runSetRotation = function(rotation){
		if(typeof rotation=="string"){
			rotation = avalue[rotation];
		}
		runPackage(213,0,rotation);
	};
/////////////////////////////////////////////////////	
	function sendPackage(argList, type){
		var bytes = [0xff, 0x55, 0, 0, type];
		for(var i=0;i<argList.length;++i){
			var val = argList[i];
			if(val.constructor == "[class Array]"){
				bytes = bytes.concat(val);
			}else{
				bytes.push(val);
			}
		}
		bytes[2] = bytes.length - 3;
		device.send(bytes);
	}
	function runPackage(){
		sendPackage(arguments, 2);
	}
	function getPackage(){		
		var nextID = arguments[0];
		Array.prototype.shift.call(arguments);
		sendPackage(arguments, 1);
	}
    var inputArray = [];
	var _isParseStart = false;
	var _isParseStartIndex = 0;
    function processData(bytes) {
		var len = bytes.length;
		if(_rxBuf.length>30){
			_rxBuf = [];
		}
		for(var index=0;index<bytes.length;index++){
			var c = bytes[index];
			_rxBuf.push(c);
			if(_rxBuf.length>=2){
				if(_rxBuf[_rxBuf.length-1]==0x55 && _rxBuf[_rxBuf.length-2]==0xff){
					_isParseStart = true;
					_isParseStartIndex = _rxBuf.length-2;
				}
				if(_rxBuf[_rxBuf.length-1]==0xa && _rxBuf[_rxBuf.length-2]==0xd&&_isParseStart){
					_isParseStart = false;
					
					var position = _isParseStartIndex+2;
					var extId = _rxBuf[position];
					position++;
					var type = _rxBuf[position];
					position++;
					//1 byte 2 float 3 short 4 len+string 5 double
					var value;
					switch(type){
						case 1:{
							value = _rxBuf[position];
							position++;
						}
							break;
						case 2:{
							value = readFloat(_rxBuf,position);
							position+=4;
						}
							break;
						case 3:{
							value = readShort(_rxBuf,position);
							position+=2;
						}
							break;
						case 4:{
							var l = _rxBuf[position];
							position++;
							value = readString(_rxBuf,position,l);
						}
							break;
						case 5:{
							value = readDouble(_rxBuf,position);
							position+=4;
						}
							break;
					}
					if(type<=5){
						if(values[extId]!=undefined){
							responseValue(extId,values[extId](value,extId));
						}else{
							responseValue(extId,value);
						}
						values[extId] = null;
					}
					_rxBuf = [];
				}
			} 
		}
    }
	function readFloat(arr,position){
		var f= [arr[position],arr[position+1],arr[position+2],arr[position+3]];
		return parseFloat(f);
	}
	function readShort(arr,position){
		var s= [arr[position],arr[position+1]];
		return parseShort(s);
	}
	function readDouble(arr,position){
		return readFloat(arr,position);
	}
	function readString(arr,position,len){
		var value = "";
		for(var ii=0;ii<len;ii++){
			value += String.fromCharCode(_rxBuf[ii+position]);
		}
		return value;
	}
    function appendBuffer( buffer1, buffer2 ) {
        return buffer1.concat( buffer2 );
    }

    // Extension API interactions
    var potentialDevices = [];
    ext._deviceConnected = function(dev) {
        potentialDevices.push(dev);

        if (!device) {
            tryNextDevice();
        }
    }
    function tryNextDevice() {
        // If potentialDevices is empty, device will be undefined.
        // That will get us back here next time a device is connected.
        device = potentialDevices.shift();
        if (device) {
            device.open({ stopBits: 0, bitRate: 115200, ctsFlowControl: 0 }, deviceOpened);
        }
    }
    var watchdog = null;
    function deviceOpened(dev) {
        if (!dev) {
            // Opening the port failed.
            tryNextDevice();
            return;
        }
        device.set_receive_handler('icbrick',processData);
    };
    ext._deviceRemoved = function(dev) {
        if(device != dev) return;
        device = null;
    };
    ext._shutdown = function() {
        if(device) device.close();
        device = null;
    };
    ext._getStatus = function() {
        if(!device) return {status: 1, msg: 'Kadapapa disconnected'};
        if(watchdog) return {status: 1, msg: 'Probing for Kadapapa'};
        return {status: 2, msg: 'Kadapapa connected'};
    }
    var descriptor = {};
	ScratchExtensions.register('Kadapapa', descriptor, ext, {type: 'serial'});
})({});

/*


	var slots = {
		Slot1:1,
		Slot2:2
	};
	var shutterStatus = {
		Press:0,
		Release:1,
		'Focus On':2,
		'Focus Off':3,
	};


	ext.getLightOnBoard = function(nextID){
		var deviceId = 31;
		getPackage(nextID,deviceId,6);
	}

	ext.runDigital = function(pin,level) {
        runPackage(30,pin,typeof level=="number"?level:levels[level]);
    };
	ext.runRGB = function(port,ledIndex,red,green,blue){
		ext.runLedStrip(port, 2, ledIndex, red,green,blue);
	};
	ext.runLedStrip = function(port,slot,ledIndex,red,green,blue){
	if(typeof port=="string"){
		port = ports[port];
	}
	if("all" == ledIndex){
		ledIndex = 0;
	}
	if(typeof slot=="string"){
		slot = slots[slot];
	}
	runPackage(8,port,slot,ledIndex,red,green,blue);
	};	
	ext.runBot = function(direction,speed) {
		var leftSpeed = 0;
		var rightSpeed = 0;
		if(direction=="run forward"){
			leftSpeed = -speed;
			rightSpeed = speed;
		}else if(direction=="run backward"){
			leftSpeed = speed;
			rightSpeed = -speed;
		}else if(direction=="turn left"){
			leftSpeed = speed;
			rightSpeed = speed;
		}else if(direction=="turn right"){
			leftSpeed = -speed;
			rightSpeed = -speed;
		}
        runPackage(5,short2array(leftSpeed),short2array(rightSpeed));
    };
	function runPackageForFace(){
		var bytes = [0xff, 0x55, 0, 0, 2];
		for(var i=0;i<arguments.length;i++){
			if(arguments[i].constructor == "[class Array]"){
				bytes = bytes.concat(arguments[i]);
			}else{
				bytes.push(arguments[i]);
			}
		}
		bytes[2] = bytes.length+13;
		device.send(bytes);
	}
	
		var bytes = [0xff, 0x55, 0, 0, 2];
		for(var i=0;i<arguments.length;i++){
			if(arguments[i].constructor == "[class Array]"){
				bytes = bytes.concat(arguments[i]);
			}else{
				bytes.push(arguments[i]);
			}
		}
		bytes[2] = bytes.length-3;
		device.send(bytes);	
		
		
				var nextID = arguments[0];
		
		var bytes = [0xff, 0x55];
		bytes.push(arguments.length+1);
		bytes.push(0);
		bytes.push(1);
		for(var i=1;i<arguments.length;i++){
			bytes.push(arguments[i]);
		}
		device.send(bytes);
		
	ext.getButtonOnBoard = function(nextID,status){
		var deviceId = 35;
		if(typeof status == "string"){
			if(status=="pressed"){
				status = 0;
			}else if(status=="released"){
				status = 1;
			}
		}
		getPackage(nextID,deviceId,7,status);
	}
	
	
	ext.gatCompass = function(nextID,port){
    	var deviceId = 26;
		if(typeof port=="string"){
			port = ports[port];
		}
		getPackage(nextID,deviceId,port);
    };

	ext.getJoystick = function(nextID,port,ax) {
		var deviceId = 5;
		if(typeof port=="string"){
			port = ports[port];
		}
		if(typeof ax=="string"){
			ax = axis[ax];
		}
		getPackage(nextID,deviceId,port,ax);
    };



    ext.getTouchSensor = function(port){
    	var deviceId = 51;
    	if(typeof port=="string"){
			port = ports[port];
		}
		getPackage(0,deviceId,port);
    };




	
	ext.getIR = function(nextID){
		var deviceId = 13;
		getPackage(nextID,deviceId);
	}
	    ext.getFlame = function(nextID,port){
   		var deviceId = 24;
		if(typeof port=="string"){
			port = ports[port];
		}
		getPackage(nextID,deviceId,port);
    };

	*/
