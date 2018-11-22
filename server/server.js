const fs=require('fs');
const spider=require('./spider.js');
const express=require('express');
const app=express();
app.listen(11111);


app.get('/index',async (req,res)=>{
	let options=spider.getOptions('index');
	let [html,songs]=await Promise.all([spider.request(options),spider.getAjaxData('/weapi/personalized/newsong')]);
	let indexSongs=getIndexSongs(html);
	songs=songsFormat(songs);
	if (indexSongs&&songs){
		res.header('Content-Type','application/json;charset=UTF-8');
		res.end(JSON.stringify({indexSongs,songs}));
	} else {
		res.end('-1');
	}
});
app.get('/index/detail',async (req,res)=>{
	let detail;
	try {
		detail=await spider.postAjaxData('/weapi/v3/playlist/detail',{"id":3778678,"n":20});
		let json=detailFormat(detail);
		res.header('Content-Type','application/json;charset=UTF-8');
		res.end(JSON.stringify(json));
	} catch (e){
		console.error(e);
		res.end(e);
	}
});
app.get('/index/search/hot',async (req,res)=>{
	let hot;
	try {
		hot=await spider.postAjaxData('/weapi/search/hot',{"type":1111});
		let json=hotFormat(hot);
		res.header('Content-Type','application/json;charset=UTF-8');
		res.end(JSON.stringify(json));
	} catch (e){
		console.error(e);
		res.end(e);
	}
});
app.get('/index/search/suggest/keyword',async (req,res)=>{
	let allMatch;
	let keyword=req.query.keyword.trim();
	try {
		allMatch=await spider.postAjaxData('/weapi/search/suggest/keyword',{"s":keyword});
		let json=allMatchFormat(allMatch);
		res.header('Content-Type','application/json;charset=UTF-8');
		res.end(JSON.stringify(json));
	} catch (e){
		console.error(e);
		res.end(e);
	}
});
app.get('/index/search/suggest/multimatch',async (req,res)=>{
	let multimatch;
	let s=req.query.s.trim();
	try {
		multimatch=await spider.postAjaxData('/weapi/search/suggest/multimatch',{"s":s,"limit":10,"version":4});
		let json=multimatchFormat(multimatch);
		res.header('Content-Type','application/json;charset=UTF-8');
		res.end(JSON.stringify(json));
	} catch (e){
		console.error(e);
		res.end(e);
	}
});
app.get('/index/search/get',async (req,res)=>{
	let get;
	let {s,offset}=req.query;
	try {
		get=await spider.postAjaxData('/weapi/search/get',{"s":s,"type":1,"limit":20,"offset":Number(offset),"strategy":5,"queryCorrect":true});
		let json=getFormat(get);
		res.header('Content-Type','application/json;charset=UTF-8');
		res.end(JSON.stringify(json));
	} catch (e){
		console.error(e);
		res.end(e);
	}
});
app.get('/player',async (req,res)=>{
	let id=req.query.id;
	try {
		let [url,lyric]=await Promise.all([
			spider.postAjaxData('/weapi/song/enhance/player/url',{"ids":`["${id}"]`,"br":"128000"}),
			spider.postAjaxData('/weapi/song/lyric',{"id":id,"lv":0,"tv":0})
		]);
		url=urlFormat(url);
		lyric=lyricFormat(lyric);
		let json=Object.assign(url,lyric);
		res.header('Content-Type','application/json;charset=UTF-8');
		res.end(JSON.stringify(json));
	} catch (e){
		console.error(e);
		res.end(e);
	}
});
app.get('/player/get',async (req,res)=>{
	let id=req.query.id;
	try {
		let hotComments=await spider.postAjaxData('/weapi/v1/resource/comments/get',{"resourceType":4,"resourceId":id,"limit":15,"commentsNum":5});
		hotComments=hotCommentsFormat(hotComments);
		res.header('Content-Type','application/json;charset=UTF-8');
		res.end(JSON.stringify(hotComments));
	} catch (e){
		console.error(e);
		res.end(e);
	}
});
app.get('/player/simiPlaylist',async (req,res)=>{
	let id=req.query.id;
	try {
		let playlist=await spider.postAjaxData('/weapi/discovery/simiPlaylist',{"songid":id});
		playlist=playlistFormat(playlist);
		res.header('Content-Type','application/json;charset=UTF-8');
		res.end(JSON.stringify(playlist));
	} catch (e){
		console.error(e);
		res.end(e);
	}
});
app.get('/player/simiSong',async (req,res)=>{
	let id=req.query.id;
	try {
		let simiSong=await spider.postAjaxData('/weapi/v1/discovery/simiSong',{"songid":id});
		simiSong=simiSongFormat(simiSong);
		res.header('Content-Type','application/json;charset=UTF-8');
		res.end(JSON.stringify(simiSong));
	} catch (e){
		console.error(e);
		res.end(e);
	}
});
function songsFormat(songs){
	let json=JSON.parse(songs).result;
	let arr=json.map(item=>{
		return {
			name:item.song.name,
			id:item.song.id,
			alias:item.song.alias,
			artists:item.song.artists.map(item2=>{
				return {
					id:item2.id,
					name:item2.name
				}
			}),
			album:{
				id:item.song.album.id,
				name:item.song.album.name,
				picUrl:item.song.album.picUrl
			},
			privilege:{
				maxbr:item.song.privilege.maxbr
			}
		}
	});
	return arr;
}

function getIndexSongs(file){
	let patt=/"_list":[\s\S]+?]]/;
	if (patt.test(file)){
		let str='{'+patt.exec(file)[0]+'}';
		let json=JSON.parse(str)._list;
		let arr=[];
		json.forEach(item1=>{
			item1.forEach(item2=>{
				arr.push({
					id:item2.id,
					name:item2.name,
					picUrl:item2.picUrl,
					playCount:item2.playCount,
				});
			});
		});
		return arr;
	}
}

function detailFormat(detail){
	let json=JSON.parse(detail);
	let playlist={
		updateTime:json.playlist.updateTime,
		tracks:json.playlist.tracks.map(item=>{
			return {
				name:item.name,
				id:item.id,
				alias:item.alia,
				artists:item.ar.map(item2=>{
					return {
						id:item2.id,
						name:item2.name
					}
				}),
				album:{
					id:item.al.id,
					name:item.al.name,
					picUrl:item.al.picUrl
				}
			}
		})
	};
	let privileges=json.privileges.map(item=>{
		return {
			maxbr:item.maxbr
		}
	});
	return {playlist,privileges};
}

function hotFormat(hot){
	let json=JSON.parse(hot);
	let hots=json.result.hots.map(item=>{
		return {
			first:item.first
		}
	});
	return hots;
}

function allMatchFormat(allMatch){
	let json=JSON.parse(allMatch);
	if (!json.result.allMatch){
		return [];
	}
	let arr=json.result.allMatch.map(item=>{
		return {
			keyword:item.keyword
		}
	});
	return arr;
}

function multimatchFormat(multimatch){
	let json=JSON.parse(multimatch);
	let result={};
	if (json.result.album){
		result.album=[{
			name:json.result.album[0].name,
			id:json.result.album[0].id,
			artists:json.result.album[0].artists.map(item=>{
				return {
					name:item.name,
					id:item.id
				}
			}),
			picUrl:json.result.album[0].picUrl,
			alias:json.result.album[0].alias
		}];
	}
	if (json.result.artist){
		result.artist=json.result.artist.map(item=>{
			return {
				id:item.id,
				name:item.name,
				// picUrl:item.picUrl,
				picUrl:item.img1v1Url, //后端改这个字段，前段不管了
				alias:item.alias
			}
		});
	}
	return result;
}

function getFormat(get){
	let json=JSON.parse(get);
	let result=json.result;
	if (result.songs){
		result.songs=result.songs.map(item=>{
			return {
				id:item.id,
				name:item.name,
				album:{
					id:item.al.id,
					name:item.al.name,
					picUrl:item.al.picUrl
				},
				artists:item.ar.map(item2=>{
					return {
						id:item2.id,
						name:item2.name
					}
				}),
				privilege:{
					maxbr:item.privilege.maxbr
				},
				alias:item.alia
			}
		});
	}
	return result;
}

function urlFormat(url){
	let json=JSON.parse(url);
	let result={
		url:json.data[0].url
	};
	return result;
}
function lyricFormat(lyric){
	let json=JSON.parse(lyric);
	let result={
		lyric:json.lrc.lyric,
		tlyric:json.tlyric.lyric
	};
	return result;
}
function hotCommentsFormat(comments){
	let json=JSON.parse(comments);
	let result=json.hotComments.map(item=>{
		return {
			user:{
			    nickname: item.user.nickname,
			    avatarUrl: item.user.avatarUrl,
			    userId: item.user.userId,
			},
			commentId: item.commentId,
			likedCount: item.likedCount,
			time: item.time,
			content: item.content
		}
	})
	return result;
}
function playlistFormat(playlist){
	let json=JSON.parse(playlist);
	let result=json.playlists.map(item=>{
		return {
			name:item.name,
			playCount:item.playCount,
			coverImgUrl:item.coverImgUrl,
			creator:{
				nickname:item.creator.nickname
			}
		}
	});
	return result;
}
function simiSongFormat(simiSong){
	console.log(simiSong)
	let json=JSON.parse(simiSong);
	let result=json.songs.map(item=>{
		return {
			id:item.id,
			name:item.name,
			album:{
				id:item.al.id,
				name:item.al.name,
				picUrl:item.al.picUrl
			},
			artists:item.ar.map(item2=>{
				return {
					id:item2.id,
					name:item2.name
				}
			}),
			privilege:{
				maxbr:item.privilege.maxbr
			},
			alias:item.alia
		}
	});
	return result;
}
/*
detail
{"id":"1323303094","c":"[{\"id\":\"1323303094\"}]"}

get
{} 无用

url
{"ids":"[\"1323303094\"]","br":"128000"}

lyric
{"id":"1323303094","lv":0,"tv":0}

get 评论
{"resourceType":4,"resourceId":"1323303094","limit":15,"commentsNum":5}

simiPlaylist 包含歌单
{"songid":"1323303094"}

simiSong 喜欢这首歌的人。。
{"songid":"1323303094"}
*/
/*app.get('/test',async (req,res)=>{
	let options=spider.getOptions('index','/song?id=557581476');
	let html=await spider.request(options);
	console.log(html);
	fs.writeFile('test.html',html,err=>{
		if (err) throw err;
	});
	res.end('1');
})*/
/*app.get('/test2',(req,res)=>{
	fs.readFile('./test.html','utf8',(err,file)=>{
		if (err) throw err;
		let patt=/window\.REDUX_STATE\s?=\s?({.*?});/;
		let str=file.match(patt)[1];
		let json=JSON.parse(str);
		res.header('Content-Type','application/json;charset=UTF-8')
		res.end(str);
	})
})*/