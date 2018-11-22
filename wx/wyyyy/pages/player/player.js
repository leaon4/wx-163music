const app = getApp();
const ip=app.globalData.ip;
const backgroundAudioManager=wx.getBackgroundAudioManager();
//music.163.com/api/img/blur/2542070883747732.jpg2542070883747732

const albumDatas=[
  {
    name:'细数那些值得单曲循环的英文歌',
    playCount:10189024,
    coverImgUrl:'../img/player/1.webp',
    creator:{
      nickname:'鹿白川'
    }
  },
  {
    name:'励志摇滚 · 人生本是永无止境的攀登',
    playCount:6340676,
    coverImgUrl:'../img/player/2.webp',
    creator:{
      nickname:'xept'
    }
  },
  {
    name:'支撑美术画画Or肝作业的力量 耐听 杂食',
    playCount:7877379,
    coverImgUrl:'../img/player/3.webp',
    creator:{
      nickname:'樱剑乱舞'
    }
  }
];
albumDatas.forEach(item=>{
  if (item.playCount>=100000000){
    item.playCount=(item.playCount/100000000).toFixed(1)+'亿';
  } else if (item.playCount>=10000){
    item.playCount=(item.playCount/10000).toFixed(1)+'万';
  }
});

const imgEXT='webp?imageView&thumbnail=80x0&quality=75&tostatic=0&type=webp';

const otherSongs=[
  {
    name:'Heavy',
    artists:[{
        name: "Linkin Park"
      },{
        name: "Kiiara"
      }
    ],
    album:{
      name: "One More Light",
      picUrl: "http://p4.music.126.net/AKMCVZLlpqhatVIAB7ES7w==/18769762999562848.jpg"
    }
  },
  {
    name:'Immortals (End Credit Version) ["From "Big Hero 6”]',
    artists:[{
        name: "Fall Out Boy"
      }],
    album:{
      name: 'Immortals (End Credit Version) ["From "Big Hero 6”]',
      picUrl: "http://p4.music.126.net/bNUPs_rIYO99Vq9QXjiCEg==/109951163219122966.jpg"
    }
  },
  {
    name:'No Vacancy',
    artists:[{
        name: "OneRepublic"
      }],
    album:{
      name: 'No Vacancy',
      picUrl: "http://p3.music.126.net/uZAjQoOgp36qDiFN-BIKgA==/19149094509449986.jpg"
    }
  },
  {
    name:'Demons',
    artists:[{
        name: "Imagine Dragons"
      }],
    album:{
      name: 'Night Visions',
      picUrl: "http://p4.music.126.net/xjB2VeMBFT53xOrNb2Pp5A==/2539871861093257.jpg"
    }
  },
  {
    name:`Don't Threaten Me With A Good Time`,
    artists:[{
        name: "Panic! At The Disco"
      }],
    album:{
      name: 'Death Of A Bachelor',
      picUrl: "http://p4.music.126.net/hoPofH2eXrgAlkvgXqiDFQ==/3296335861497708.jpg"
    }
  },
];
otherSongs.forEach(item=>{
  item.album.picUrl=item.album.picUrl.slice(0,-3)+imgEXT;
  item.artistName=item.artists.map(item=>item.name).join(' / ');
});

Page({
  data: {
    song:null,
    top:0,
    lrcItemHeight:50,
    lrc:null,
    lrcIndex:0,
    playState:'running',
    playT:0,
    albumDatas,
    icon:app.globalData.icon,
    otherSongs,
    hotComments:null,
  },
  onLoad: function (option) {
    let picUrl=decodeURIComponent(option.picUrl);
    let picUrlExt=picUrl.match(/\d+\.[a-z]+$/)[0];
    this.setData({
      song:{
        id:option.song_id,
        name:option.name,
        artists:JSON.parse(option.artists),
        picUrl:app.globalData.imgFormat(picUrl,'playerAlbum'),
        blurPicUrl:'//music.163.com/api/img/blur/'+picUrlExt
      }
    });
    wx.request({
      url:`http://${ip}:11111/player?id=${option.song_id}`,
      success:(res)=>{
        this._init(res.data);
      },
      fail(e){
        console.error(e);
      }
    });
    wx.request({
      url:`http://${ip}:11111/player/get?id=${option.song_id}`,
      success:(res)=>{
        this._commentsFormat(res.data);
        this.setData({
          hotComments:res.data
        });
      },
      fail(e){
        console.error(e);
      }
    });
  },
  prev(){
    backgroundAudioManager.seek(150)
  },
  _init(data){
    this._lrcParse(data);
    backgroundAudioManager.title=this.data.song.name;
    backgroundAudioManager.epname =this.data.song.name;
    backgroundAudioManager.singer = this.data.song.artists[0].name;
    backgroundAudioManager.coverImgUrl = this.data.song.picUrl;
    backgroundAudioManager.src = data.url;
    backgroundAudioManager.onPlay(this.onMusicPlay);
    backgroundAudioManager.onPause(this.onMusicPause);
    backgroundAudioManager.onError((res)=>{
      console.error(res);
    });
    // 注册这个事件，currentTime才能准确
    backgroundAudioManager.onTimeUpdate(()=>{
      // console.info(innerAudioContext.currentTime)
    });
  },
  _lrcParse(data){
    let lrc=LRCparse(data.lyric);
    let lrc_ch=LRCparse(data.tlyric);
    let arr=[];
    for (let i in lrc){
      arr.push({
        time:Number(i),
        lrc:lrc[i],
        lrc_ch:lrc_ch[i]
      });
    }
    this.setData({
      lrc:arr,
      lrcItemHeight:JSON.stringify(lrc_ch)!=='{}'?50:32
    });

    function LRCparse(lyric){
      lyric=lyric.replace(/’/g,"'");
      let json={};
      let patt=/\[(\d\d):(\d\d\.\d+)\] ?(.+)\n/g;
      lyric.replace(patt,(match,p1,p2,p3)=>{
        let time=~~(p1*60000+Number(p2)*1000);
        json[time]=p3.trim();
      });
      return json;
    }
  },
  lrcBegin(){
    let lastTime=~~(backgroundAudioManager.currentTime*1000);
    let time=this.data.lrc[this.data.lrcIndex].time-lastTime;
    this.data.playT=setTimeout(this._loop,time);
  },
  _loop(){

    if (this.data.lrcIndex>0){
      this._lrcUp();
    } else {
      this.setData({
        lrcIndex:this.data.lrcIndex+1
      });
    }
    if (this.data.lrcIndex>=this.data.lrc.length) return;
    // +150为修正偏差
    let lastTime=~~(backgroundAudioManager.currentTime*1000)+150;
    let time=this.data.lrc[this.data.lrcIndex].time-lastTime;
    this.data.playT=setTimeout(this._loop,time);
  },
  _lrcUp(){
    this.setData({
      top:this.data.top+this.data.lrcItemHeight,
      lrcIndex:this.data.lrcIndex+1
    });
  },
  pauseBtnClick(){
    if (backgroundAudioManager.paused){
      backgroundAudioManager.play();
    } else {
      backgroundAudioManager.pause();
    }
  },
  onMusicPlay(){
    this.setData({
      playState:'running'
    });
    this.lrcBegin();
  },
  onMusicPause(){
    clearTimeout(this.data.playT);
    this.setData({
      playState:'paused'
    });
  },
  aa(){
    console.log(1)
  },
  _commentsFormat(hotComments){
    hotComments.forEach(item=>{
      item.user.avatarUrl=app.globalData.imgFormat(item.user.avatarUrl,'avatar');
      let date=new Date(item.time);
      item.time=date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日';
      if (item.likedCount>=100000){
        item.likedCount=(item.likedCount/10000).toFixed(1).replace(/\.0$/,'')+'万';
      }
    });
  }
});
