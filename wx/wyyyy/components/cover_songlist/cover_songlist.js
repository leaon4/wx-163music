Component({
  properties:{
    songs:{
      type:Array,
      value:[]
    },
    hasIndex:{
      type:Boolean,
      value:false
    }
  },
  methods:{
    listTap(e){
      let {id,name,album:{picUrl},artists,privilege}=this.data.songs[e.currentTarget.dataset.songIndex];
      let modal=this.songPrivilege(privilege);
      if (modal.msg||modal.modal){
        wx.showModal({
          title: '播放失败',
          content: '此歌曲为付费歌曲'
        });
        return;
      }
      picUrl=encodeURIComponent(picUrl);
      wx.navigateTo({
        url:`/pages/player/player?song_id=${id}&name=${name}&picUrl=${picUrl}&artists=${JSON.stringify(artists)}`
      });
    },
    songPrivilege: function(e) {
       e = e || {};
       var t = ""
         , n = 0;
       return e.st == -300 ? (t = "版权方要求，该歌曲仅能通过网易云音乐APP播放",
       n = -2) : 4 == e.fee ? 0 == e.payed ? (t = "购买",
       n = 2) : e.payed > 0 && (2048 & e.flag) > 0 && (t = "版权方要求，该歌曲须下载后播放",
       n = 4) : e.fee > 0 && 0 == e.pl ? (t = "会员",
       n = 3) : e.fee > 0 && 8 != e.fee && 32 != e.fee && e.pl <= 0 ? (t = "唱片公司要求该歌曲须付费，打开网易云音乐购买后即可自由畅享",
       n = 1) : e.pl <= 0 && (t = "由于版权保护，您所在的地区暂时无法使用",
       n = -1),
       {
           msg: t,
           modal: n
       }
    },
  }
})