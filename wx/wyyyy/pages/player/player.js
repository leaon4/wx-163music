const app = getApp();
const ip=app.globalData.ip;
const innerAudioContext=wx.createInnerAudioContext();
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

const avatarEXT='webp?imageView&thumbnail=60x0&quality=75&tostatic=0&type=webp';
const hotComments=[
{
    "user":
    {
        "nickname": "Pmok",
        "avatarUrl": "http://p1.music.126.net/yANLDaiPbR-f5ifnVs6ENw==/109951163120543268.jpg",
        "userId": 342773635,
    },
    "commentId": 375215448,
    "likedCount": 67639,
    "time": 1494060119323,
    "content": "我一女生看NBA，听电音，唱Rap，我觉得没毛病🙃"
},
{
    "user":
    {
        "nickname": "MARVEL-漫威",
        "avatarUrl": "http://p1.music.126.net/SIoAfmcr578DptZF8Up-WQ==/109951162859085597.jpg",
        "userId": 326842539,
    },
    "commentId": 331948232,
    "likedCount": 52239,
    "time": 1489676156971,
    "content": "虽然有人说查斯特上年纪了，吼不动了，但是我们的信仰怎么可能会改变呢？"
},
{
    "user":
    {
        "nickname": "仲夏恋上秋",
        "avatarUrl": "http://p2.music.126.net/njbUU5CwQjOHBZSJ4iWFbg==/109951163575877867.jpg",
        "userId": 96654217,
    },
    "commentId": 333170406,
    "likedCount": 40826,
    "time": 1489812327421,
    "content": "网易云音乐上线了4.0版本，用户纷纷表示没有什么大变化，难道只有我发现韩国榜单消失了吗？云音乐就是这么有态度的良心软件。音乐无国界，但听众有国界！[强][强][强]"
},
{
    "user":
    {
        "nickname": "林肯公园售票处",
        "avatarUrl": "http://p2.music.126.net/sJSUAn5vJjJCMC20hNww9g==/109951163572407451.jpg",
        "userId": 379167606,
    },
    "commentId": 331948511,
    "likedCount": 17918,
    "time": 1489676428309,
    "content": "#Linkin Park# 公布了《One More Light》的歌单。共十首《Nobody Can Save Me》；《Good Goodbye》；《Talking To Myself》；《Battle Symphony》；《Invisible》；《Heavy》；《Sorry For Now》；《Halfway Right》；《One More Light》；《Sharp Edges》。专辑将于5月19日发行，小伙伴们坐等新砖吧。"
},
{
    "user":
    {
        "nickname": "AwkwaMat",
        "avatarUrl": "http://p2.music.126.net/5MO6UCO9EBphos4ErSRF9w==/109951163298847770.jpg",
        "userId": 55313989,
    },
    "commentId": 331964395,
    "likedCount": 14911,
    "time": 1489677205494,
    "content": "与其说Linkin Park由原来的摇滚变得太Pop，辨识度不高，还不如说每张专辑、每首歌都在探索新的旋律、编曲与唱法，旋律真的很好听啊[爱心]"
}];
hotComments.forEach(item=>{
  item.user.avatarUrl=item.user.avatarUrl.slice(0,-3)+avatarEXT;
  item.time=new Date(item.time).toLocaleString().split(' ')[0].replace('/','年').replace('/','月');
});

Page({
  data: {
    song:null,
    top:0,
    lrcItemHeight:50,
    lrc:null,
    lrcIndex:0,
    currentHightLight:0,
    playState:'running',
    playT:0,
    albumDatas,
    icon:app.globalData.icon,
    otherSongs,
    hotComments
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
  },
  prev(){
    innerAudioContext.seek(150)
  },
  _init(data){
    this._lrcParse(data);
    console.log(this.data.lrc);
    innerAudioContext.src=data.url;
    innerAudioContext.autoplay=true;
    innerAudioContext.onPlay(()=>{
      this.lrcBegin();
    });
    innerAudioContext.onError((res)=>{
      console.error(res);
    });
    // 注册这个事件，currentTime才能准确
    innerAudioContext.onTimeUpdate(()=>{
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
    let lastTime=~~(innerAudioContext.currentTime*1000);
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
    let lastTime=~~(innerAudioContext.currentTime*1000)+150;
    let time=this.data.lrc[this.data.lrcIndex].time-lastTime;
    this.data.playT=setTimeout(this._loop,time);
  },
  _lrcUp(){
    this.setData({
      top:this.data.top+this.data.lrcItemHeight,
      lrcIndex:this.data.lrcIndex+1
    });
  },
  /*_loop(){
    if (this.data.lrcIndex>0){
      this._lrcUp();
    }
    if (this.data.lrcIndex>=this.data.lrc.length-1) return;
    // +150为修正偏差
    let lastTime=~~(innerAudioContext.currentTime*1000)+150;
    let time=this.data.lrc[this.data.lrcIndex+1].time-lastTime;
    this.setData({
      lrcIndex:this.data.lrcIndex+1
    });
    this.data.playT=setTimeout(this._loop,time);
  },
  _lrcUp(){
    this.setData({
      top:this.data.top+this.data.lrcItemHeight,
      currentHightLight:this.data.currentHightLight+1
    });
  },*/
  musicPause(){
    if (this.data.playState==='running'){
      clearTimeout(this.data.playT);
      innerAudioContext.pause();
      this.setData({
        playState:'paused'
      });
    } else {
      innerAudioContext.play();
      this.setData({
        playState:'running'
      });
    }
  },
  aa(){
    console.log(1)
  }
});
