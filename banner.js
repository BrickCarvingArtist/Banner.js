/**name:Banner.js*author:Pengcheng Yang/nbugs.com*description:This widget powered by YPC from "nbugs.com" which is written by original javascript. You can choose a direction and make it auto slide. It also support mobile touch events. You may use it easily even you don't know anything about css layouts. It proves an interface to make it work in your pages and has a outset function to add attributes if you need towards each anchor.*/
function BlankTimer(){};
BlankTimer.prototype = {
	constructor : BlankTimer,
	t : null,
	_start : function(callBack, touch){
		var _this = this;
		this.t = setTimeout(function(){
			callBack();
			_this._end();
		}, touch ? 0 : 5000);
	},
	_end: function(){
		clearInterval(this.t);
	}
};
function Banner(obj){
	this.position = document.querySelector(obj.position);
	this.direction = obj.direction.toLowerCase() === "ltr" ? true: false;
	this.receiveData = obj.data;
	this.currentItem = 0;
	this._init();
};
Banner.prototype = {
	constructor : Banner,
	_init : function(){
		this._buildDom();
		this._setData();
		this._setMovements();
		this._autoMove(this.direction);
	},
	_buildDom : function(){
		this.banner = document.createElement("div");
		this.banner.className = "banner";
		this._buildContainer();
		this._buildTitle();
		this.position.appendChild(this.banner);
		this.bannerWidth = parseFloat(document.defaultView.getComputedStyle(this.banner, null).width);
	},
	_buildContainer : function() {
		this.container = document.createElement("div");
		this.container.className = "container";
		for(var i = 0; i < 3; i++){
			this["item" + (i + 1)] = document.createElement("a");
			this["item" + (i + 1) + "Img"] = document.createElement("img");
			this["item" + (i + 1)].appendChild(this["item" + (i + 1) + "Img"]);
			this.container.appendChild(this["item" + (i + 1)]);
		}
		this.banner.appendChild(this.container);
	},
	_buildTitle: function(){
		this.title = document.createElement("div");
		this.title.className = "title";
		this.titleText = document.createElement("span");
		this.iconBox = document.createElement("p");
		this.icons = new Array(this.receiveData.length);
		for(var i = 0; i < this.icons.length; i++){
			this.icons[i] = document.createElement("em");
			this.icons[i].appendChild(document.createTextNode("●"));
			this.iconBox.appendChild(this.icons[i]);
		}
		this.title.appendChild(this.titleText);
		this.title.appendChild(this.iconBox);
		this.banner.appendChild(this.title);
		this._highlightIcon();
	},
	_setData : function(){
		this._resetPosition();
		this.item1.setAttribute("href", this.receiveData[this.currentItem - 1 < 0 ? this.receiveData.length - 1 : this.currentItem - 1].anchorHref);
		this.item1Img.setAttribute("src", this.receiveData[this.currentItem - 1 < 0 ? this.receiveData.length - 1 : this.currentItem - 1].imgSrc);
		this.item2.setAttribute("href", this.receiveData[this.currentItem].anchorHref);
		this.item2Img.setAttribute("src", this.receiveData[this.currentItem].imgSrc);
		this.item3.setAttribute("href", this.receiveData[this.currentItem + 1 > this.receiveData.length - 1 ? 0 : this.currentItem + 1].anchorHref);
		this.item3Img.setAttribute("src", this.receiveData[this.currentItem + 1 > this.receiveData.length - 1 ? 0 : this.currentItem + 1].imgSrc);
		if(this.receiveAttributes){
			this.setItemAttributes();
		}
	},
	_setTitle : function(){
		this.titleText.innerHTML = this.receiveData[this.currentItem].title;
	},
	_resetPosition : function(){
		this.item1.style.left = -this.bannerWidth + "px";
		this.item2.style.left = 0;
		this.item3.style.left = this.bannerWidth + "px";
	},
	_highlightIcon : function(touch){
		this.icons[(touch || this.direction) ? this.currentItem < this.receiveData.length - 1 ? this.currentItem + 1 : 0 : this.currentItem > 0 ? this.currentItem - 1 : this.receiveData.length - 1].removeAttribute("class");
		this.icons[this.currentItem].className = "chosen";
		this._setTitle();
	},
	_move : function(type, x){
		if(type){
			this.item2.style.left = x - this.bannerWidth + "px";
			this.item3.style.left = x + "px";
			this.item1.style.left = this.bannerWidth + "px";
		}else{
			this.item1.style.left = x - this.bannerWidth + "px";
			this.item2.style.left = x + "px";
			this.item3.style.left = this.bannerWidth + "px";
		}
	},
	_autoMove : function(type, x, touch){
		var _this = this,
		offsetX = x ? x: type ? 0 : this.bannerWidth;
		this.blankTime = new BlankTimer();
		this.blankTime._start(!type ?
		function(){
			var t = setInterval(function(){
				if (offsetX > 0) {
					offsetX -= _this.bannerWidth / 100;
					_this._move(true, offsetX);
				} else {
					clearInterval(t);
					offsetX = 0;
					_this._move(true, offsetX);
					_this.currentItem = _this.currentItem + 1 > _this.receiveData.length - 1 ? 0 : _this.currentItem + 1;
					_this._highlightIcon(type);
					_this._setData();
					_this._autoMove();
				}
			}, 5);
		} : function(){
			var t = setInterval(function(){
				if(offsetX < _this.bannerWidth){
					offsetX += _this.bannerWidth / 100;
					_this._move(false, offsetX);
				}else{
					clearInterval(t);
					offsetX = _this.bannerWidth;
					_this._move(false, offsetX);
					_this.currentItem = _this.currentItem - 1 < 0 ? _this.receiveData.length - 1 : _this.currentItem - 1;
					_this._highlightIcon(type);
					_this._setData();
					_this._autoMove(type);
				}
			}, 5);
		}, touch);
	},
	_touchMove : function(type, distance){
		if(type){
			this.item2.style.left = distance + "px";
			this.item1.style.left = distance - this.bannerWidth + "px";
			this.item3.style.left = -this.bannerWidth + "px";
		}else{
			this.item2.style.left = -distance + "px";
			this.item3.style.left = -distance + this.bannerWidth + "px";
			this.item1.style.left = this.bannerWidth + "px";
		}
	},
	_setMovements : function(){
		var _this = this,
		startX = 0,
		touchDirection;
		this.banner.addEventListener("touchstart", function(e){
			e.preventDefault();
			startX = e.changedTouches[0].pageX;
			_this.blankTime._end();
		}, false);
		this.banner.addEventListener("touchmove", function(e){
			e.preventDefault();
			touchDirection = e.changedTouches[0].pageX > startX;
			_this._touchMove(touchDirection, Math.abs(e.changedTouches[0].pageX - startX))
		}, false);
		this.banner.addEventListener("touchend", function(e) {
			e.preventDefault();
			_this._autoMove(touchDirection, e.changedTouches[0].pageX, true)
		}, false);
	},
	setItemAttributes : function(attributes){
		this.receiveAttributes = this.receiveAttributes || attributes;
		for(var i in this.receiveAttributes[this.direction ? this.currentItem + 1 > this.receiveData.length - 1 ? 0 : this.currentItem + 1 : this.currentItem >= 0 ? this.currentItem - 1 : this.receiveData.length - 1]){
			this.item2.removeAttribute(i);
		}
		for(var i in this.receiveAttributes[this.currentItem]){
			this.item2.setAttribute(i, this.receiveAttributes[this.currentItem][i]);
		}
	}
};