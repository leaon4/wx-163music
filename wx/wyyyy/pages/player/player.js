const app = getApp();
const ip=app.globalData.ip;
const backgroundAudioManager=wx.getBackgroundAudioManager();
//music.163.com/api/img/blur/2542070883747732.jpg2542070883747732

Page({
  data: {
    song:null,
    top:0,
    lrcItemHeight:50,
    lrc:null,
    lrcIndex:0,
    playState:'running',
    playT:0,
    simiPlaylist:null,
    icon:app.globalData.icon,
    simiSongs:null,
    hotComments:null,
    commentsLimit:5,
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
    wx.request({
      url:`http://${ip}:11111/player/simiPlaylist?id=${option.song_id}`,
      success:(res)=>{
        this._simiListFormat(res.data);
        this.setData({
          simiPlaylist:res.data
        });
      },
      fail(e){
        console.error(e);
      }
    });
    wx.request({
      url:`http://${ip}:11111/player/simiSong?id=${option.song_id}`,
      success:(res)=>{
        this._simiSongsFormat(res.data);
        this.setData({
          simiSongs:res.data
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
    this._play(data);
    backgroundAudioManager.onPlay(this.onMusicPlay);
    backgroundAudioManager.onPause(this.onMusicPause);
    backgroundAudioManager.onEnded(()=>{
      this.setData({
        top:0,
        lrcIndex:0
      });
      this._play(data);
    });
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
      let patt=/\[(\d\d):(\d\d\.\d+)\] ?(.+)\n?/g;
      lyric.replace(patt,(match,p1,p2,p3)=>{
        let time=~~(p1*60000+Number(p2)*1000);
        json[time]=p3.trim();
      });
      return json;
    }
  },
  _play(data){
    backgroundAudioManager.title=this.data.song.name;
    backgroundAudioManager.epname =this.data.song.name;
    backgroundAudioManager.singer = this.data.song.artists[0].name;
    backgroundAudioManager.coverImgUrl = this.data.song.picUrl;
    backgroundAudioManager.src = data.url;
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
    // 有的歌词格式不对，（比如有的说不支持自动滚动）
    if (this.data.lrc.length){
      this.lrcBegin();
    }
  },
  onMusicPause(){
    clearTimeout(this.data.playT);
    this.setData({
      playState:'paused'
    });
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
  },
  commentsExpand(){
    this.setData({
      commentsLimit:1000
    });
  },
  _simiListFormat(list){
    list.forEach(item=>{
      if (item.playCount>=100000000){
        item.playCount=(item.playCount/100000000).toFixed(1)+'亿';
      } else if (item.playCount>=10000){
        item.playCount=(item.playCount/10000).toFixed(1)+'万';
      }
    });
  },
  _simiSongsFormat(songs){
    songs.forEach(item=>{
      // item.album.picUrl=item.album.picUrl.slice(0,-3)+imgEXT;
      item.album.formattedPicUrl=app.globalData.imgFormat(item.album.picUrl,'simiSong');
      // item.artistName=item.artists.map(item=>item.name).join(' / ');
    }); 
  }
});
