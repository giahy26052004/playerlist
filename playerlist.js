const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'HY_PLAYER_STORAGE_KEY';
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const progress = $('#progress')
const cd = $('.cd')
const playbtn = $('.btn-toggle-play');
const player = $('.player')
const nextBtn = $('.btn-next');
const preBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $(".playlist");
const app = {

    currentIndex: 0,
    isPlaying: false,
    isRamdom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [

        {
            name: "Ba Kiếp Tình Một Kiếp Duyên",
            singer: "Raftaar x Fortnite",
            path: "./music/Ba Kiếp Tình Một Kiếp Duyên-Lâm Tuấn.mp3",
            image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
        {
            name: "Tu Phir Se Aana",
            singer: "Lao tâm khổ tứ",
            path: "./music/Lao Tâm Khổ Tứ - Thanh Hưng.mp3",
            image:
                "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
            name: "Một Bước Yêu Vạn Dặm Đau",
            singer: "Raftaar x Brobha V",
            path: "./music/Một Bước Yêu Vạn Dặm Đau-Mr. Siro.mp3",
            image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
            name: "Thay Tôi Yêu Cô Ấy",
            singer: "Raftaar x Nawazuddin Siddiqui",
            path: "./music/Thay Tôi Yêu Cô Ấy-Thanh Hưng.mp3",
            image:
                "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
            name: "Thay Tôi Yêu Cô Ấy",
            singer: "Raftaar",
            path: "./music/Thay Tôi Yêu Cô Ấy-Thanh Hưng.mp3",
            image:
                "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        {
            name: "Feeling You",
            singer: "Raftaar x Harjas",
            path: "./music/Thay Tôi Yêu Cô Ấy-Thanh Hưng.mp3",
            image:
                "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        },

    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem('user', 'huy')
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },


    render: function () {
        _this = this
        const html = this.songs.map(function (song, index) {
            return `
            <div class="song ${index === _this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
        `;
        })
        playlist.innerHTML = html.join("\n")
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },

    scrollToActiveIntoView: function () {
        setTimeout(function () {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300);


    },
    loadConfig: function () {
        this.isRamdom = this.config.isRamdom
        this.isRepeat = this.config.isRepeat
    },
    //  hiển thị nhạc đang phát 
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path

    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    preSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong: function () {
        let arrplayed = []
        const selectNewIndex = () => {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * this.songs.length)
            } while (arrplayed.includes(newIndex) && (newIndex !== this.currentIndex));
            return newIndex;
        }

        const hasPlayed = () => {
            return arrplayed.length === this.songs.length
        }
        if (hasPlayed())
            arrplayed = [];
        const newCurentIndex = selectNewIndex();
        this.currentIndex = newCurentIndex
        arrplayed.push(newCurentIndex)
        this.loadCurrentSong()
    },
    handleEvent: function () {
        const _this = this
        // xử lí khi click play

        playbtn.addEventListener('click', function () {
            if (!_this.isPlaying) {
                audio.play()
            } else {
                audio.pause()
            }
            // đĩa xoay

            audio.onplay = () => {
                _this.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
            }

            // nhấn nút pause
            audio.onpause = () => {
                _this.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause()

            }
            // khi tiến độ thay đổi
        })
        audio.ontimeupdate = () => {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        progress.oninput = (e) => {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }


        nextBtn.onclick = () => {
            if (_this.isRamdom) {
                _this.randomSong()
            }
            else {
                _this.nextSong()
            }
            audio.play()
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
            // thêm xóa class active 
            document.querySelector(`body > div.player > div.playlist > div.song.active`).classList.remove('active');
            document.querySelector(`body > div.player > div.playlist > div.song:nth-child(${_this.currentIndex + 1})`).classList.add('active');
            _this.scrollToActiveIntoView();
        }
        preBtn.onclick = () => {
            // thêm xóa class active khi ở vị trí đầu
            if (_this.currentIndex === 0) {
                document.querySelector(`body > div.player > div.playlist > div.song:last-child`).classList.add('active');
                document.querySelector(`body > div.player > div.playlist > div.song:first-child`).classList.remove('active');
            }
            if (_this.isRamdom) {
                _this.randomSong()
            }
            else {
                _this.preSong()
            }
            audio.play()
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
            // thêm xóa class active khi ở vị trí 
            document.querySelector(`body > div.player > div.playlist > div.song.active`).classList.remove('active');
            document.querySelector(`body > div.player > div.playlist > div.song:nth-child(${_this.currentIndex + 1})`).classList.add('active');
            _this.scrollToActiveIntoView();

        }
        // xử lí khi bấm nút randomBtn
        randomBtn.onclick = () => {

            _this.isRamdom = !_this.isRamdom
            _this.setConfig('isRamdom', _this.isRamdom)
            randomBtn.classList.toggle('active', _this.isRamdom)
        }
        repeatBtn.onclick = () => {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            }
            else {
                nextBtn.click()
            }
        }
        playlist.onclick = (e) => {
            const songElement = e.target.closest('.song:not(.active)')
            if (songElement || e.target.closest('.option')) {
                if (songElement) {
                    _this.currentIndex = Number(songElement.dataset.index)
                    _this.loadCurrentSong();
                    _this.render()
                    audio.play()
                    _this.isPlaying = true
                    player.classList.add('playing')
                    cdThumbAnimate.play()


                }
                if (e.target.closest('.option')) {

                }
            }
        }




        const cdThumbAnimate = cdThumb.animate(([
            { transform: 'rotate(360deg)' }
        ]), {
            duration: 3000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // xử lí phóng to 
        const cdWidth = cd.offsetWidth
        document.onscroll = function () {

            const scrolltop = window.scrollY || document.documentElement.scrollTop
            const newcdWidth = cdWidth - scrolltop
            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0

            cd.style.opacity = newcdWidth / cdWidth

        };
    },
    start: function () {
        // load thông tin đã lưu của nút ramdom và repeatBtn
        this.loadConfig()
        // định nghĩa 
        this.defineProperties()
        // render
        this.render()
        // lắng nghe sự kiện 
        this.handleEvent()
        // hiển thị trạng thái của nút play
        this.loadCurrentSong()
        // hiển thị trạng thái của nút ramdom và repeat
        randomBtn.classList.toggle('active', _this.isRamdom)
        repeatBtn.classList.toggle('active', _this.isRepeat)
    },
}

app.start()
