//选中用到的对象
const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  mainAudio = wrapper.querySelector("#main-audio"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = progressArea.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  moreMusicBtn = wrapper.querySelector("#more-music"),
  closemoreMusic = musicList.querySelector("#close");
playPauseIcon = wrapper.querySelector("#start");

let musicIndex = Math.floor(Math.random() * allMusic.length + 1);
isMusicPaused = true;

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playingSong();
});

//函数，用于加载音乐，参数为对应音乐的序号
function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  //加载音乐和背景图
  musicImg.src = `images/${allMusic[indexNumb - 1].src}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

//函数，用于播放音乐
function playMusic() {
  //播放音乐时，显示暂停按钮
  wrapper.classList.add("paused");
  playPauseIcon.setAttribute("class", "iconfont icon-24gf-pause2 play");
  //播放音乐
  mainAudio.play();
}

//音乐暂停
function pauseMusic() {
  //暂停音乐时，显示播放按钮
  wrapper.classList.remove("paused");
  playPauseIcon.setAttribute("class", "iconfont icon-bofang play");
  //暂停
  mainAudio.pause();
}

//函数，用于播放上一首
function prevMusic() {
  //音乐对应序号减一
  musicIndex--;
  //第一首的前一首是最后一首
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

//函数，用于播放下一首
function nextMusic() {
  //音乐对应序号加一
  musicIndex++;
  //最后一首的下一首是第一首
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

//给播放按钮添加点击事件
playPauseBtn.addEventListener("click", () => {
  const isMusicPlay = wrapper.classList.contains("paused");
  //判断当前是否正在播放，如果正在播放，点击则暂停，反之亦然
  isMusicPlay ? pauseMusic() : playMusic();
  playingSong();
});

//给上一首按钮增加点击事件
prevBtn.addEventListener("click", () => {
  //调用函数，切换至上一首
  prevMusic();
});

//给下一首按钮增加点击事件
nextBtn.addEventListener("click", () => {
  //调用函数，切换至下一首
  nextMusic();
});

//更新音乐的进度条
mainAudio.addEventListener("timeupdate", (e) => {
  //获取当前播放的时间
  const currentTime = e.target.currentTime;
  //获取音乐总时间
  const duration = e.target.duration;
  //计算当前播放的百分比
  let progressWidth = (currentTime / duration) * 100;
  //给css赋值
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time"),
    musicDuartion = wrapper.querySelector(".max-duration");
  //给音乐添加事件，用于更新播放的事件
  mainAudio.addEventListener("loadeddata", () => {
    //获取播放时间并转化成分和秒
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if (totalSec < 10) {
      //不够十秒补零
      totalSec = `0${totalSec}`;
    }
    //显示获取到的音乐总时间
    musicDuartion.innerText = `${totalMin}:${totalSec}`;
  });
  //更新当前播放的时刻
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    //不够十秒补零
    currentSec = `0${currentSec}`;
  }
  //显示获取到的当前播放时刻
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//给进度条添加点击事件，用于跳转播放
progressArea.addEventListener("click", (e) => {
  //获取进度条的宽度
  let progressWidth = progressArea.clientWidth;
  //获取点击进度条时的x坐标
  let clickedOffsetX = e.offsetX;
  //获取音乐总长度
  let songDuration = mainAudio.duration;
  //修改音乐播放的当前时刻，及跳转播放
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  //调用播放音乐的函数
  playMusic();
  playingSong();
});

//切换更改播放方式的按钮
const repeatBtn = wrapper.querySelector("#repeat-plist");
//给切换按钮添加点击事件
repeatBtn.addEventListener("click", () => {
  //获取当前的播放方式（单曲循环，列表循环，随机）
  let getText = repeatBtn.title;
  switch (getText) {
    //当前为列表循环时，点击修改为单曲循环
    case "repeat":
      repeatBtn.setAttribute("class", "iconfont icon-danquxunhuan");
      repeatBtn.setAttribute("title", "repeat_one");
      break;
    //当前为单曲循环时，点击修改为随机播放
    case "repeat_one":
      repeatBtn.setAttribute("class", "iconfont icon-suijibofang");
      repeatBtn.setAttribute("title", "shuffle");
      break;
    //当前为随机播放时，点击修改为列表循环
    case "shuffle":
      repeatBtn.setAttribute("class", "iconfont icon-liebiaoxunhuan");
      repeatBtn.setAttribute("title", "repeat");
      break;
  }
});

//给音乐结束添加事件
mainAudio.addEventListener("ended", () => {
  //获取当前播放方式
  let getText = repeatBtn.title;
  //根据当前不同的播放方式，确定下一首播放哪个音乐
  switch (getText) {
    //当前为列表循环时，调用播放下一首
    case "repeat":
      nextMusic();
      break;
    //当前为单曲循环时，重新加载当前音乐
    case "repeat_one":
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    //当前为随机播放时，随机获取下一首的序号，并播放
    case "shuffle":
      let randIndex = Math.floor(Math.random() * allMusic.length + 1);
      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex == randIndex);
      musicIndex = randIndex;
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});

//给所有音乐按钮添加点击事件
moreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});
//给关闭所以音乐按钮添加点击事件
closemoreMusic.addEventListener("click", () => {
  moreMusicBtn.click();
});

//选中所有音乐界面的列表
const ulTag = wrapper.querySelector("ul");
//用js生成音乐列表
for (let i = 0; i < allMusic.length; i++) {
  //利用循环，给每一首歌生成HTML代码
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].src}" src="songs/${
    allMusic[i].src
  }.mp3"></audio>
              </li>`;
  //将生成的代码插入到ul中
  ulTag.insertAdjacentHTML("beforeend", liTag);
  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  //获取每一首音乐的时长，用于在所有音乐界面显示
  liAudioTag.addEventListener("loadeddata", () => {
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if (totalSec < 10) {
      //不够十秒则补零
      totalSec = `0${totalSec}`;
    }
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`;
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });
}

//函数，用于在所有音乐界面播放音乐
function playingSong() {
  const allLiTag = ulTag.querySelectorAll("li");

  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");

    if (allLiTag[j].classList.contains("playing")) {
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    if (allLiTag[j].getAttribute("li-index") == musicIndex) {
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }
    //给所有音乐界面的音乐添加点击事件
    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}

//所有音乐界面每个条目的点击事件
function clicked(element) {
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}
