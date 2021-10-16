
/*
    1. Render songs
    2. Scroll top
    3. Play/pause/seek
    4. CD rotate
    5. Next/prev
    6. Random
    7. Next/Repeat when ended
    8. Active song
    9. Scroll active song into view
    10. Play song when click
    */
var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    isplaying: false,
    isRandom: false,
    isRepeat: false,
    currentIndex: 0,
    songs: [
        {
            name: "Muộn rồi mà sao còn",
            singer: "Sơn Tùng M-TP",
            path: "./assets/music/muon-roi-ma-sao-con.mp3",
            image: "./assets/image/muon-roi-ma-sao-con.jpg"
        },
        {
            name: "Peaches",
            singer: "Justin Bieber",
            path: "./assets/music/peaches.mp3",
            image:
                "./assets/image/peaches.jpg"
        },
        {
            name: "Chúng ta của hiện tại",
            singer: "Sơn Tùng M-TP",
            path:
                "./assets/music/chung-ta-cua-hien-tai.m4a",
            image: "./assets/image/chung-ta-cua-hien-tai.jpg"
        },
        {
            name: "Money",
            singer: "Lisa",
            path: "./assets/music/money.mp3",
            image:
                "./assets/image/money.jpg"
        },
        {
            name: "Inferno",
            singer: "Bella Poarch",
            path: "./assets/music/inferno.mp3",
            image:
                "./assets/image/inferno.jpg"
        },
        {
            name: "Hold on",
            singer: "Justin Bieber",
            path:
                "./assets/music/hold-on.mp3",
            image:
                "./assets/image/hold-on.jpg"
        },
        {
            name: "Look what you made me do",
            singer: "Taylor Swift",
            path: "./assets/music/look-what-you-made-me-do.mp3",
            image:
                "./assets/image/look-what-you-made-me-do.jpg"
        }
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
    <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
        <div class="thumb"
            style="background-image: url('${song.image}')">
        </div>
        <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
        </div>
        <div class="option">
            <i class="fas fa-ellipsis-h"></i>
        </div>
    </div>
    `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
            // this.songs[currentIndex];
        })
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        //Xử lý CD quay/dừng
        const cdThumbAnimate = cdThumb.animate(
            [{ transform: 'rotate(360deg)' }],
            {
                duration: 10000, //10 seconds
                iterations: Infinity
            }
        )
        cdThumbAnimate.pause();

        //Xử lý phóng to/thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            var newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        //Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isplaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        //Khi song được play 
        audio.onplay = function () {
            _this.isplaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        //Khi song bị pause
        audio.onpause = function () {
            _this.isplaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        //Xử lý khi tua song
        progress.oninput = function () {
            audio.currentTime = Math.floor(progress.value * audio.duration / 100);
        }

        //Khi next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        //Khi prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        //Khi bấm random song
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        //Xử lý lặp lại bài hát
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active');
        }

        //Xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            }
            else {
                nextBtn.click();
            }
        }

        //Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {

                //Xử lý khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.getAttribute('data-index'));
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                }

                //Xử lý khi click vào song option
            }
        }
    },

    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300)
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        //Định nghĩa các thuộc tính cho object
        this.defineProperties();

        //Lắng nghe/xử lý các sự kiện (DOM events)
        this.handleEvents();

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        //Render playlist
        this.render();
    },
}

app.start();
