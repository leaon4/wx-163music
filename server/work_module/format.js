module.exports = {
    songsFormat,
    indexSongsFormat,
    detailFormat,
    hotFormat,
    allMatchFormat,
    multimatchFormat,
    getFormat,
    urlFormat,
    lyricFormat,
    hotCommentsFormat,
    playlistFormat,
    simiSongFormat,
}

function songsFormat(songs) {
    let json = JSON.parse(songs).result;
    let arr = json.map(item => {
        return {
            name: item.song.name,
            id: item.song.id,
            alias: item.song.alias,
            artists: item.song.artists.map(item2 => {
                return {
                    id: item2.id,
                    name: item2.name
                }
            }),
            album: {
                id: item.song.album.id,
                name: item.song.album.name,
                picUrl: item.song.album.picUrl
            },
            privilege: {
                maxbr: item.song.privilege.maxbr,
                st: item.song.privilege.st,
                fee: item.song.privilege.fee,
                payed: item.song.privilege.payed,
                flag: item.song.privilege.flag,
                pl: item.song.privilege.pl,
            }
        }
    });
    return arr;
}

function indexSongsFormat(file) {
    let patt = /"_list":[\s\S]+?]]/;
    if (patt.test(file)) {
        let str = '{' + patt.exec(file)[0] + '}';
        let json = JSON.parse(str)._list;
        let arr = [];
        json.forEach(item1 => {
            item1.forEach(item2 => {
                arr.push({
                    id: item2.id,
                    name: item2.name,
                    picUrl: item2.picUrl,
                    playCount: item2.playCount,
                });
            });
        });
        return arr;
    }
}

function detailFormat(detail) {
    let json = JSON.parse(detail);
    let playlist = {
        updateTime: json.playlist.updateTime,
        tracks: json.playlist.tracks.map(item => {
            return {
                name: item.name,
                id: item.id,
                alias: item.alia,
                artists: item.ar.map(item2 => {
                    return {
                        id: item2.id,
                        name: item2.name
                    }
                }),
                album: {
                    id: item.al.id,
                    name: item.al.name,
                    picUrl: item.al.picUrl
                }
            }
        })
    };
    let privileges = json.privileges.map(item => {
        return {
            maxbr: item.maxbr,
            st: item.st,
            fee: item.fee,
            payed: item.payed,
            flag: item.flag,
            pl: item.pl,
        }
    });
    return {
        playlist,
        privileges
    };
}

function hotFormat(hot) {
    let json = JSON.parse(hot);
    let hots = json.result.hots.map(item => {
        return {
            first: item.first
        }
    });
    return hots;
}

function allMatchFormat(allMatch) {
    let json = JSON.parse(allMatch);
    if (!json.result.allMatch) {
        return [];
    }
    let arr = json.result.allMatch.map(item => {
        return {
            keyword: item.keyword
        }
    });
    return arr;
}

function multimatchFormat(multimatch) {
    let json = JSON.parse(multimatch);
    let result = {};
    if (json.result.album) {
        result.album = [{
            name: json.result.album[0].name,
            id: json.result.album[0].id,
            artists: json.result.album[0].artists.map(item => {
                return {
                    name: item.name,
                    id: item.id
                }
            }),
            picUrl: json.result.album[0].picUrl,
            alias: json.result.album[0].alias
        }];
    }
    if (json.result.artist) {
        result.artist = json.result.artist.map(item => {
            return {
                id: item.id,
                name: item.name,
                // picUrl:item.picUrl,
                picUrl: item.img1v1Url, //后端改这个字段，前段不管了
                alias: item.alias
            }
        });
    }
    return result;
}

function getFormat(get) {
    let json = JSON.parse(get);
    let result = json.result;
    if (result.songs) {
        result.songs = result.songs.map(item => {
            return {
                id: item.id,
                name: item.name,
                album: {
                    id: item.al.id,
                    name: item.al.name,
                    picUrl: item.al.picUrl
                },
                artists: item.ar.map(item2 => {
                    return {
                        id: item2.id,
                        name: item2.name
                    }
                }),
                privilege: {
                    maxbr: item.privilege.maxbr,
                    st: item.privilege.st,
                    fee: item.privilege.fee,
                    payed: item.privilege.payed,
                    flag: item.privilege.flag,
                    pl: item.privilege.pl,
                },
                alias: item.alia
            }
        });
    }
    return result;
}

function urlFormat(url) {
    let json = JSON.parse(url);
    let result = {
        url: json.data[0].url
    };
    return result;
}

function lyricFormat(lyric) {
    try {
        let json = JSON.parse(lyric);
        let result = {
            lyric: json.lrc.lyric,
            tlyric: json.tlyric.lyric
        };
        return result;
    } catch (e) {
        // 歌词形式太多了。只要这一步解析失败一律返回空对象
        return {}
    }
}

function hotCommentsFormat(comments) {
    let json = JSON.parse(comments);
    let result = json.hotComments.map(item => {
        return {
            user: {
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

function playlistFormat(playlist) {
    let json = JSON.parse(playlist);
    let result = json.playlists.map(item => {
        return {
            name: item.name,
            playCount: item.playCount,
            coverImgUrl: item.coverImgUrl,
            creator: {
                nickname: item.creator.nickname
            }
        }
    });
    return result;
}

function simiSongFormat(simiSong) {
    let json = JSON.parse(simiSong);
    let result = json.songs.map(item => {
        return {
            id: item.id,
            name: item.name,
            album: {
                id: item.album.id,
                name: item.album.name,
                picUrl: item.album.picUrl
            },
            artists: item.artists.map(item2 => {
                return {
                    id: item2.id,
                    name: item2.name
                }
            }),
            privilege: {
                maxbr: item.privilege.maxbr,
                st: item.privilege.st,
                fee: item.privilege.fee,
                payed: item.privilege.payed,
                flag: item.privilege.flag,
                pl: item.privilege.pl,
            },
            alias: item.alias
        }
    });
    return result;
}