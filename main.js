const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd');
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config:JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs:[
        {
            name: 'Cô Đơn Dành Cho Ai',
            singer: 'Minh Đương ft Anh',
            path: './songs/1.mp3',
            image:'./images/1.jpg'
        },
        {
            name: 'Ép Duyên',
            singer: 'Minh Đương',
            path: './songs/2.mp3',
            image:'./images/2.jpg'
        },
        {
            name: 'Hạ Còn Vương Nắng',
            singer: 'Minh Đương ft DatKa',
            path: './songs/3.mp3',
            image:'./images/3.jpg'
        },
        {
            name: 'Phận Duyên Lỡ Làng',
            singer: 'Singer Đương',
            path: './songs/4.mp3',
            image:'./images/4.jpg'
        },
        {
            name: 'Trắc Trở',
            singer: 'Kim Anh',
            path: './songs/5.mp3',
            image:'./images/5.jpg'
        },
        {
            name: 'Tương Phùng',
            singer: 'Minh Đương-MTP ',
            path: './songs/6.mp3',
            image:'./images/6.jpg'
        },
        {
            name: 'Lệ Duyên Tình',
            singer:'Huỳnh Kim Anh',
            path: './songs/7.mp3',
            image:'./images/7.jpg'
        },
        {
            name: 'Mình Anh Nơi Này',
            singer: 'Minh Đương',
            path: './songs/8.mp3',
            image:'./images/8.jpg'
        },
        {
            name: 'Đánh Mất Em',
            singer: 'Kim Anh ft Đương',
            path: './songs/9.mp3',
            image:'./images/9.jpg'
        },
        {
            name: 'Anh Mệt Rồi',
            singer: 'Võ Đương',
            path: './songs/10.mp3',
            image:'./images/10.jpg'
        },
    ],
    setConfig:function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}"data-index="${index}">
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

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function () {
        const _this =this;
        const cdWidth = cd.offsetWidth;
        
        //Xử lí CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration:10000, // 10 giây
            iterations:Infinity
        })
        cdThumbAnimate.pause()
        //Xử lí phóng to thu nhỏ CD
            document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        //Xử lí khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();             
            } else {
                audio.play()    
            }
            
        }
        //Khi bài hát được play
        audio.onplay = function () {
            _this.isPlaying = true       
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        //Khi song bị Pause
        audio.onpause = function () {
            _this.isPlaying = false       
            player.classList.remove('playing')
            cdThumbAnimate.pause()

        }
        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
            progress.value = progressPercent
        }
        //Xử lí khi tua song
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value 
            audio.currentTime = seekTime
        }
        //Khi Next bài hát
        nextBtn.onclick = function () {
            if(_this.isRandom){
                _this.playRandomSong()
            } else {
            _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
         //Khi Prev bài hát
         prevBtn.onclick = function () {
            if(_this.isRandom){
                _this.playRandomSong()
            } else {
            _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //Xử lí next song khi kết thúc audio
        audio.onended = function () {
            if (_this.isRepeat){
                audio.play();
            } else {
            nextBtn.click()
            }
        }
        //Xử lí khi random bài hát
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle("active", _this.isRandom)

        }
        //Xử lí lặp lại một Song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle("active", _this.isRepeat)
        }
        //Lắng nghe hành vi bấm vào playlist
        playlist.onclick = function(e){
            const songNode= e.target.closest('.song:not(.active)')
            //Xử lí khi click vào song list
            if ( songNode || e.target.closest('.option')) {
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                //Xử lí khi click vào song option
                if(e.target.closest('.option')) {

                }
            }
        }

    },
    loadCurrentSong: function () {
        
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function () {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if(this.currentIndex < 0 ) {
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()

    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block:'nearest'
            })
        },100)
    },
    start: function(){
        //Gán cấu hình từ config vào ứng dụng
        this.loadConfig()
        //Định nghĩa các thuộc tính cho object
        this.defineProperties()

        //Lắng nghe xử lí các sự kiện DOM Event
        this.handleEvents()
        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()
        // Render playlist
        this.render()

        //Hiển thị trạng thái ban đầu của button repeat & random
        randomBtn.classList.toggle("active", this.isRandom)
        repeatBtn.classList.toggle("active", this.isRepeat)
    }


}
app.start();