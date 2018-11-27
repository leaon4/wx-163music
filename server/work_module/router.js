const fs = require('fs');
const spider = require('./spider.js');
const format = require('./format.js');
const express = require('express');

const router = express.Router();
module.exports = router;

router.get('/index', async(req, res) => {
    let options = spider.getOptions('index');
    let [html, songs] = await Promise.all([spider.request(options), spider.getAjaxData('/weapi/personalized/newsong')]);
    let indexSongs = format.indexSongsFormat(html);
    songs = format.songsFormat(songs);
    if (indexSongs && songs) {
        res.header('Content-Type', 'application/json;charset=UTF-8');
        res.end(JSON.stringify({
            indexSongs,
            songs
        }));
    } else {
        res.end('-1');
    }
});

router.get('/index/detail', async(req, res) => {
    let detail;
    try {
        detail = await spider.postAjaxData('/weapi/v3/playlist/detail', {
            "id": 3778678,
            "n": 20
        });
        let json = format.detailFormat(detail);
        res.header('Content-Type', 'application/json;charset=UTF-8');
        res.end(JSON.stringify(json));
    } catch (e) {
        console.error(e);
        res.end(e);
    }
});

router.get('/index/search/hot', async(req, res) => {
    let hot;
    try {
        hot = await spider.postAjaxData('/weapi/search/hot', {
            "type": 1111
        });
        let json = format.hotFormat(hot);
        res.header('Content-Type', 'application/json;charset=UTF-8');
        res.end(JSON.stringify(json));
    } catch (e) {
        console.error(e);
        res.end(e);
    }
});

router.get('/index/search/suggest/keyword', async(req, res) => {
    let allMatch;
    let keyword = req.query.keyword.trim();
    try {
        allMatch = await spider.postAjaxData('/weapi/search/suggest/keyword', {
            "s": keyword
        });
        let json = format.allMatchFormat(allMatch);
        res.header('Content-Type', 'application/json;charset=UTF-8');
        res.end(JSON.stringify(json));
    } catch (e) {
        console.error(e);
        res.end(e);
    }
});

router.get('/index/search/suggest/multimatch', async(req, res) => {
    let multimatch;
    let s = req.query.s.trim();
    try {
        multimatch = await spider.postAjaxData('/weapi/search/suggest/multimatch', {
            "s": s,
            "limit": 10,
            "version": 4
        });
        let json = format.multimatchFormat(multimatch);
        res.header('Content-Type', 'application/json;charset=UTF-8');
        res.end(JSON.stringify(json));
    } catch (e) {
        console.error(e);
        res.end(e);
    }
});

router.get('/index/search/get', async(req, res) => {
    let get;
    let {
        s,
        offset
    } = req.query;
    try {
        get = await spider.postAjaxData('/weapi/search/get', {
            "s": s,
            "type": 1,
            "limit": 20,
            "offset": Number(offset),
            "strategy": 5,
            "queryCorrect": true
        });
        let json = format.getFormat(get);
        res.header('Content-Type', 'application/json;charset=UTF-8');
        res.end(JSON.stringify(json));
    } catch (e) {
        console.error(e);
        res.end(e);
    }
});

router.get('/player', async(req, res) => {
    let id = req.query.id;
    try {
        let [url, lyric] = await Promise.all([
            spider.postAjaxData('/weapi/song/enhance/player/url', {
                "ids": `["${id}"]`,
                "br": "128000"
            }),
            spider.postAjaxData('/weapi/song/lyric', {
                "id": id,
                "lv": 0,
                "tv": 0
            })
        ]);
        url = format.urlFormat(url);
        lyric = format.lyricFormat(lyric);
        let json = Object.assign(url, lyric);
        res.header('Content-Type', 'application/json;charset=UTF-8');
        res.end(JSON.stringify(json));
    } catch (e) {
        console.error(e);
        res.end(e);
    }
});

router.get('/player/get', async(req, res) => {
    let id = req.query.id;
    try {
        let hotComments = await spider.postAjaxData('/weapi/v1/resource/comments/get', {
            "resourceType": 4,
            "resourceId": id,
            "limit": 15,
            "commentsNum": 5
        });
        hotComments = format.hotCommentsFormat(hotComments);
        res.header('Content-Type', 'application/json;charset=UTF-8');
        res.end(JSON.stringify(hotComments));
    } catch (e) {
        console.error(e);
        res.end(e);
    }
});

router.get('/player/simiPlaylist', async(req, res) => {
    let id = req.query.id;
    try {
        let referer = 'https://music.163.com/m/song?id=' + id;
        let playlist = await spider.postAjaxData('/weapi/discovery/simiPlaylist', {
            "songid": id
        }, referer);
        playlist = format.playlistFormat(playlist);
        res.header('Content-Type', 'application/json;charset=UTF-8');
        res.end(JSON.stringify(playlist));
    } catch (e) {
        console.error(e);
        res.end(e);
    }
});

router.get('/player/simiSong', async(req, res) => {
    let id = req.query.id;
    try {
        let referer = 'https://music.163.com/m/song?id=' + id;
        let simiSong = await spider.postAjaxData('/weapi/v1/discovery/simiSong', {
            "songid": id
        }, referer);
        simiSong = format.simiSongFormat(simiSong);
        res.header('Content-Type', 'application/json;charset=UTF-8');
        res.end(JSON.stringify(simiSong));
    } catch (e) {
        console.error(e);
        res.end(e);
    }
});