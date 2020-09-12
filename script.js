var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

var app = new Vue({
	el: "#app",
	data: {
		audio: "",
		imgLoaded: false,
		currentlyPlaying: false,
		currentlyStopped: false,
		currentTime: 0,
		checkingCurrentPositionInTrack: "",
		trackDuration: 0,
		currentProgressBar: 0,
		isPlaylistActive: false,
		currentSong: 0,
		debug: false, 
		musicPlaylist: [
			{
				title: "August 10th",
				artist: "i can see now",
				url: "https://audio.jukehost.co.uk/QR7pSQIjGxxtykjlXI8Ga9AoR7e9VYXT",
				image: "https://i.ibb.co/vkfdZVt/i-can-see-now.jpg"
			},
			{
				title: "August 12th",
				artist: "synesthesia",
				url: "https://audio.jukehost.co.uk/Azc6fN92GMLRLdnjD1BDcphMTzwoyB9U",
				image: "https://i.ibb.co/6JLtvhP/synesthesia.jpg"
			},
			{
				title: "August 14th",
				artist: "found in translation",
				url: "https://audio.jukehost.co.uk/4a3YY2dEg7mJC88CnWRNd2aoWQ6nq2Dd",
				image: "https://i.ibb.co/ChFRftC/found-in-translation.jpg"
			},
			{
				title: "August 16th",
				artist: "memories on loop",
				url: "https://audio.jukehost.co.uk/kCMY14VVKmSYEEGuIiBvMge89GWdaPKp",
				image: "https://i.ibb.co/4Ty4vT0/memories-on-loop.jpg"
			},

			{
			title: "August 19th",
				artist: "musical slumber party",
				url: "https://audio.jukehost.co.uk/EmKUK1JI6hhl1BxGVmcf5uOiGnL7tsx8",
				image: "https://i.ibb.co/xGVb5R6/slumber.jpg"
			},
			{
			title: "August 21st",
				artist: "chaos & calm",
				url: "https://audio.jukehost.co.uk/5sCMeRuRhbejKymZrJtpFivxOVY1IrUn",
				image: "https://i.ibb.co/12r9MvJ/chaos.jpg"
			},
			{
			title: "August 23rd",
				artist: "keyboard",
				url: "https://audio.jukehost.co.uk/2LWTmUS29kB1MHc3rqj4ZuJ7eEZY3yiD",
				image: "https://i.ibb.co/dPH15L6/keyboard.jpg"
			},
			{
			title: "August 25th",
				artist: "what is it with you",
				url: "https://audio.jukehost.co.uk/cS1KcnimeFUmXvl4YZNjwHGaqrqKUghB",
				image: "https://i.ibb.co/LvZrWhh/what-is-it.jpg"
			},

			{
				title: "August 29th",
					artist: "shades & hues",
					url: "https://audio.jukehost.co.uk/icRYQ3OyODbE3ZGVmjB3TDarVnWNTmYn",
					image: "https://i.ibb.co/SQzZHvS/shadeshues.jpg"
				},

				{
					title: "September 2nd",
						artist: "its the only way to go",
						url: "https://audio.jukehost.co.uk/4LEeO1KxkrH4XR69SOwukxmzrqf8VHkK",
						image: "https://i.ibb.co/df6RgYh/only-way.jpg"
					},

					{
						title: "September 2nd",
							artist: "i got asked the other day what freedom meant to me",
							url: "https://audio.jukehost.co.uk/tjY7WxfSliNXp8pZJpnidRV4NRU48J2n",
							image: "https://i.ibb.co/TvMbm3D/freedom.jpg"
						},

						{
							title: "September 9th",
								artist: "so vivid",
								url: "https://audio.jukehost.co.uk/R5i2DImpY2VIvSXk0TQhBDeYzi844tUG",
								image: "https://i.ibb.co/8d4MMFY/sovivid.jpg"
							},
				
			
			
		],
		audioFile: ""
	},
	mounted: function() {
		this.changeSong();
		this.audio.loop = false;
	},
	filters: {
		fancyTimeFormat: function(s) {
			return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
		}
	},
	methods: {
		togglePlaylist: function() {
			this.isPlaylistActive = !this.isPlaylistActive;
		},
		nextSong: function() {
			checkifmobile();
			if (this.currentSong < this.musicPlaylist.length - 1)
				this.changeSong(this.currentSong + 1);
		},
		prevSong: function() {
			checkifmobile();
			if (this.currentSong > 0) this.changeSong(this.currentSong - 1);
		},
		changeSong: function(index) {
			  checkifmobile();
			var wasPlaying = this.currentlyPlaying;
			this.imageLoaded = false;
			if (index !== undefined) {
				this.stopAudio();
				this.currentSong = index;
			}
			this.audioFile = this.musicPlaylist[this.currentSong].url;
			this.audio = new Audio(this.audioFile);
			var localThis = this;
			this.audio.addEventListener("loadedmetadata", function() {
				localThis.trackDuration = Math.round(this.duration);
			});
			this.audio.addEventListener("ended", this.handleEnded);
			if (wasPlaying) {
				this.playAudio();
			}
		},
		isCurrentSong: function(index) {
			if (this.currentSong == index) {
				return true;
			}
			return false;
		},
		getCurrentSong: function(currentSong) {
			return this.musicPlaylist[currentSong].url;
		},
		playAudio: function() {
			if (
				this.currentlyStopped == true &&
				this.currentSong + 1 == this.musicPlaylist.length
			) {
				this.currentSong = 0;
				this.changeSong();
			}
			if (!this.currentlyPlaying) {
				this.getCurrentTimeEverySecond(true);
				this.currentlyPlaying = true;
				this.audio.play();
			} else {
				this.stopAudio();
			}
			this.currentlyStopped = false;
		},
		stopAudio: function() {
			this.audio.pause();
			this.currentlyPlaying = false;
			this.pausedMusic();
		},
		handleEnded: function() {
			if (this.currentSong + 1 == this.musicPlaylist.length) {
				this.stopAudio();
				this.currentlyPlaying = false;
				this.currentlyStopped = true;
			} else {
				this.currentlyPlaying = false;
				this.currentSong++;
				this.changeSong();
				this.playAudio();
			}
		},
		onImageLoaded: function() {
			this.imgLoaded = true;
		},
		getCurrentTimeEverySecond: function(startStop) {
			var localThis = this;
			this.checkingCurrentPositionInTrack = setTimeout(
				function() {
					localThis.currentTime = localThis.audio.currentTime;
					localThis.currentProgressBar =
						localThis.audio.currentTime / localThis.trackDuration * 100;
					localThis.getCurrentTimeEverySecond(true);
				}.bind(this),
				1000
			);
		},
		pausedMusic: function() {
			clearTimeout(this.checkingCurrentPositionInTrack);
		},
		toggleDebug: function(){
			this.debug=!this.debug;
			document.body.classList.toggle('debug');
		}
	},
	watch: {
		currentTime: function() {
			this.currentTime = Math.round(this.currentTime);
		}
	},
	beforeDestroy: function() {
		this.audio.removeEventListener("ended", this.handleEnded);
		this.audio.removeEventListener("loadedmetadata", this.handleEnded);

		clearTimeout(this.checkingCurrentPositionInTrack);
	}
	
});


function mobileCss(){
	
	console.log("inside mobile css");
	document.getElementById("app").style.width = "70%";
	//document.getElementById("app").style.minHeight = "60rem";
	document.getElementById("playerAlbumArt").style.width = "100%";
	document.getElementById("playerAlbumArt").style.height = "100%";
	
	document.getElementById("albumImageId").style.width = "100%";
	document.getElementById("albumImageId").style.height = "500px";
	
	//document.getElementById("titleId").style.fontSize = "3rem";
	//document.getElementById("artistId").style.fontSize = "1.5rem";
	
	
	document.getElementById("playId").style.fontSize = "8rem";
	document.getElementById("previousId").style.fontSize = "4rem";
	document.getElementById("nextId").style.fontSize = "4rem";
	
	document.getElementById("h1id").style.fontSize = "3rem";
	document.getElementById("mainpid").style.fontSize = "2rem";
	document.getElementById("h3id").style.fontSize = "2rem";
	
	$(".title").css("font-size", "3rem");
	$(".artist").css("font-size", "2.5rem");
	
	setTimeout(function(){
		$(".title").css("font-size", "3rem");
	$(".artist").css("font-size", "2.5rem");
	},500);
	
	
	$('.currentTime').css("font-size", "1.5rem");
	$('.totalTime').css("font-size", "1.5rem");
	
	$('.fa').css("font-size", "30px");
	$('.fa').css("padding", "20px");
	$('.fa').css("width", "70px");
	$('.fa').css("border-radius", "35px");
	
	$('.audioPlayerList').css("height", "800px");
	$('.audioPlayerList').css("width", "100%");
	
}
function checkifmobile(){
	console.log("inside check if mobile");
	if( isMobile.any() ){
		
		mobileCss();
	}
}
checkifmobile();

