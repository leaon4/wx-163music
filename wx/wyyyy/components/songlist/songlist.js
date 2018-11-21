const ip='127.0.0.1';
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
      let {id,name,picUrl,artists}=e.currentTarget.dataset;
      picUrl=encodeURIComponent(picUrl);
      wx.navigateTo({
        url:`/pages/player/player?song_id=${id}&name=${name}&picUrl=${picUrl}&artists=${JSON.stringify(artists)}`
      });
    }
  }
})