const app = getApp();
const host=app.globalData.host;

let keywordT=0;

Page({
  data:{
    indexSongs:[],
    songs:[],
    icon:app.globalData.icon,
    playlist:null,
    labelSelected:'0',
    pageTop:0,
    searchType:'empty',// 'empty','searching','multimatch','loading','none'
    searchValue:'',
    hots:null,
    allMatch:null,
    multimatch:null,
    get:null,
    offset:0,
    lazyLoad:false,
  },
  onLoad(){
    wx.request({
      url:`http://${host}/index`,
      success:(res)=>{
        this._indexDataFormat(res.data);
        this.setData({
          indexSongs:res.data.indexSongs,
          songs:res.data.songs
        });
      },
      fail(e){
        console.error(e);
      }
    });
  },
  _indexDataFormat(data){
    data.indexSongs.forEach(item=>{
      // item.picUrl=item.picUrl.replace(/\.[a-z]+$/,app.globalData.imgExt.index);
      item.picUrl=app.globalData.imgFormat(item.picUrl,'index');
      item.playCount=item.playCount>100000000?(item.playCount/100000000).toFixed(1)+'亿':(item.playCount/10000).toFixed(1)+'万';
    });
  },
  _detailDataFormat(data){
    let {playlist,privileges}=data;
    let date=new Date(playlist.updateTime);
    playlist.updateTime=date.getMonth()+1+'月'+date.getDate()+'日';
    playlist.tracks.forEach((item,index)=>{
      /*item.privilege={
        maxbr:privileges[index].maxbr
      };*/
      item.privileges=privileges[index];
    });
  },
  labelSelecting(e){
    let index=e.target.dataset.index;
    if (index==='1'&&!this.data.playlist){
      wx.request({
        url:`http://${host}/index/detail`,
        success:(res)=>{
          this._detailDataFormat(res.data);
          this.setData({
            playlist:res.data.playlist
          });
        },
        fail(e){
          console.error(e);
        }
      });
    } else if (index==='2'&&!this.data.hots){
      wx.request({
        url:`http://${host}/index/search/hot`,
        success:(res)=>{
          this.setData({
            hots:res.data
          });
        },
        fail(e){
          console.error(e)
        }
      });
    }
    this.setData({
      labelSelected:index,
      pageTop:0
    });
  },
  input(e){
    this.setData({
      searchValue:e.detail.value,
      searchType:e.detail.value.trim()?'searching':'empty'
    });
    clearTimeout(keywordT);
    keywordT=setTimeout(()=>{
      this._keywordSearch();
    },600);
  },
  searchClear(e){
    this.setData({
      searchValue:'',
      searchType:'empty',
      allMatch:null
    });
  },
  _keywordSearch(){
    let value=this.data.searchValue.trim();
    if (!value) return;
    let url=`http://${host}/index/search/suggest/keyword?keyword=`+value;
    wx.request({
      url,
      success:(res)=>{
        this.setData({
          allMatch:res.data
        });
      },
      fail(e){
        console.error(e);
      }
    });
  },
  search(e){
    this._searching(this.data.searchValue);
  },
  searchLabelTap(e){
    this._searching(e.target.dataset.s);
  },
  searchWordTap(e){
    this._searching(e.currentTarget.dataset.s);
  },
  _searching(queryWord){
    let s=queryWord;
    this.setData({
      searchValue:s,
      searchType:'loading',
      offset:0// offset在这里统一归0
    });
    let receive=0;// 用它做Promise.all的功能
    let empty=0;// 用它判断是否都没数据
    s=encodeURIComponent(s);
    let url1=`http://${host}/index/search/suggest/multimatch?s=`+s;
    wx.request({
      url:url1,
      success:(res)=>{
        receive++;
        this._multimatchDataFormat(res.data);
        this.setData({
          searchType:receive===2?'multimatch':'loading',
          multimatch:res.data
        });
        if (!res.data.album&&!res.data.artist){
          empty++;
          if (empty===2){
            this.setData({
              searchType:'none'
            });
          }
        }
      },
      fail(e){
        console.error(e);
      }
    });
    let url2=`http://${host}/index/search/get?s=${s}&offset=0`;
    wx.request({
      url:url2,
      success:(res)=>{
        receive++;
        this.setData({
          searchType:receive===2?'multimatch':'loading',
          get:res.data
        });
        if (!res.data.songs){
          empty++;
          if (empty===2){
            this.setData({
              searchType:'none'
            });
          }
        }
      },
      fail(e){
        console.error(e);
      }
    });
  },
  _multimatchDataFormat(data){
    if (data.album){
      // data.album[0].picUrl=data.album[0].picUrl.replace(/\.[a-z]+$/,app.globalData.imgExt.list);
      data.album[0].picUrl=app.globalData.imgFormat(data.album[0].picUrl,'list');
    }
    if (data.artist){
      // data.artist[0].picUrl=data.artist[0].picUrl.replace(/\.[a-z]+$/,app.globalData.imgExt.list);
      data.artist[0].picUrl=app.globalData.imgFormat(data.artist[0].picUrl,'list');
    }
  },
  scrollToLower(e){
    if (this.data.labelSelected==='2'&&this.data.searchType==='multimatch'){
      if (this.data.offset+20>=this.data.get.songCount) return;
      this.setData({
        offset:this.data.offset+20,
        lazyLoad:true
      });
      this._searchingGet()
    }
  },
  _searchingGet(){
    let s=encodeURIComponent(this.data.searchValue);
    let url2=`http://${host}/index/search/get?s=${s}&offset=${this.data.offset}`;
    wx.request({
      url:url2,
      success:(res)=>{
        this.data.get.songs=this.data.get.songs.concat(res.data.songs);
        this.setData({
          get:this.data.get,
          lazyLoad:false
        });
        if (!res.data.songs){
          this.setData({
            searchType:'none'
          });
        }
        this.data.lazyLoad=false;
      },
      fail(e){
        console.error(e);
      }
    });
  }
});