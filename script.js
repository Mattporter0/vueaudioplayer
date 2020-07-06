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
				title: "August 19",
				artist: "re-freshed",
				url: "https://www.mboxdrive.com/eyes intro.mp3",
				image: "https://i.ibb.co/SsCRnb4/aweyes.jpg"
			},
			{
				title: "August 22nd",
				artist: "i love all the shades of you",
				url: "https://www.mboxdrive.com/colors.mp3",
				image: "https://i.ibb.co/ZztgkYf/Whats-App-Image-2020-07-04-at-1-14-00-PM.jpg"
			},
			{
				title: "September 2nd",
				artist: "found in translation",
				url: "https://www.mboxdrive.com/tagalog version (online-audio-converter.com).mp3",
				image: "https://i.pinimg.com/564x/dd/fe/c5/ddfec54d1cdcd2164f5c61e840b44d30.jpg"
			},
			{
				title: "September 5th",
				artist: "sweeter by the day, i got all this nectar",
				url: "https://www.mboxdrive.com/getting keyboard.mp3",
				image: "https://i.pinimg.com/564x/5f/aa/a8/5faaa8ce6e08ade426e8fe9b676804e5.jpg"
			},
			{
				title: "September 9th",
				artist: "vision",
				url: "https://www.mboxdrive.com/vision.mp3",
				image: "https://i.pinimg.com/564x/51/cc/2b/51cc2b8fc035d1977140a1246ec2c2be.jpg"
			},
			{
				title: "September 9th",
				artist: "memories on loop",
				url: "https://www.mboxdrive.com/rrp1.mp3",
				image: "https://i.ibb.co/1fM9dzt/Screenshot-2020-07-06-at-16-15-02.png"
			}
			
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
			if (this.currentSong < this.musicPlaylist.length - 1)
				this.changeSong(this.currentSong + 1);
		},
		prevSong: function() {
			if (this.currentSong > 0) this.changeSong(this.currentSong - 1);
		},
		changeSong: function(index) {
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

