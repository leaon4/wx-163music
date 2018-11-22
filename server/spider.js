const https=require('https');
const http=require('http');
const crypto=require('crypto');
const querystring=require('querystring');

module.exports={
    aesEncrypt,
    aesDecrypt,
    getOptions,
    getAjaxData,
    postAjaxData,
    request,
    getSearchPostData
};

function aesEncrypt(data, key, iv) {
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let crypted = cipher.update(data, 'utf8', 'base64');
    crypted += cipher.final('base64');
    return crypted;
}

function aesDecrypt(encrypted, key, iv) {
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    var decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function getOptions(type,path,contentLength){
    let options={
        hostname:'music.163.com',
        port:443,
        method:'POST',
        headers:{
            Accept: 'application/json, text/javascript',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    };
    // 首页获取songs
    if (!type||type==='general'){
        options.path=path;
        options.headers['Content-Length']=328;
        options.headers['Cookie']='JSESSIONID-WYYY=e%2BQFG0ZdwGDljf838KI4g7iIhb79JXnuvWCxInlXkMISqpv7M1u93EH%5C8g1nk55EsfKcIi%5CXPnEHe%5C3aW%2FIvsMASBQOJc8u%2FvgIVY1x06rmD1r4GSPE%5C0JBUURlbuORCg8jidc0j8ID12qcVS2dcKZjWFJEcgd7i0sm7G4%2B5h%2FRP6FRf%3A1539673244212; _iuqxldmzr_=32; _ntes_nnid=f544f39c99b8df7f1432018c55859537,1539671444232; _ntes_nuid=f544f39c99b8df7f1432018c55859537; playerid=83630952; WM_TID=sneQuQXSycQpplFA2XpLJbOYqFDHOtF5; WM_NI=HT54omoQbgs3iy%2FCNNgMkECv7BwDPOdHEOiwXIZsGNdV45My8ul2MPzr98ZcJwP00TcvrWaCuCgIEBsoASgu71%2F9rwrqVvwHddkeuToJ8Ca5zydowlh6tQdzbyDJKMtBSzg%3D; WM_NIKE=9ca17ae2e6ffcda170e2e6eeb2b75f88b189b0f63a92b48fb7d84e838f9fabf26a8cf1aad1b32193ebb7a2f92af0fea7c3b92a8c8cfbd5ee67ad8fae88f239aba7e1a4cd46a593a5a6c27ef59eb9a5d345a8988bb0ec7d9c979694c646a88afcd6d073fcaba4d3d05cbaaef7d9d9698aa9a0d1b360a1aabeb8e449b79da9aac84ab1b18fb4e67ff5efe1daf17db2af9a97f644a8bca586f860ad96f8a4e43fbaa7ac90f668aceabcb2e772a2a78cabca47b89e9d9be637e2a3';
    // 需要post参数的情况
    } else if (type==='params'){
        // options.path='/weapi/search/suggest/multimatch';
        options.path=path;
        options.headers['Content-Length']=contentLength;
        options.headers['Cookie']='_iuqxldmzr_=32; _ntes_nnid=917555d20530d5051254730b97d64f8a,1540438527791; _ntes_nuid=917555d20530d5051254730b97d64f8a; abt=5; __utmc=94650624; __utmz=94650624.1540777569.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); playerid=64144041; __utma=94650624.1987073821.1540777569.1540777569.1540781568.2; JSESSIONID-WYYY=dyIdYgx%5CtJmQZC7b%2BT1RlIhojSDBMjgqKDqBTDrbE0m6Vl1ut%2F3tSee8ClTismWW88E6nvT%5C%5C5v1EIQDFNb360Kp7MlbWWAs0qeFYjCaeEoCUtoed5OxRWCooNQ%5CGDa%2FCfpg%5CU3%2B3nHN48ESQrPxl%2BPZrbHT50MTS2M6j42%5Cb%2FUoCTUE%3A1540796778991; WM_NI=reHqTmouG1gnCXiIo1JCSDL1uan8MUHAQDETbuiGD8xaI5tIz0Y%2Bo0ypFy6vAUwo%2BFVpMYPXo4KwDlTn2vvher3ef3S4KLZCj4kS0iARHPIqlWwbpednO18yb1z3PaekbEY%3D; WM_NIKE=9ca17ae2e6ffcda170e2e6eed2ee6fa6b9e5ccf27f9ab88bb6d55a838f8eabbb6a8eaac08ded5d819bfbd1f62af0fea7c3b92ab2bb8892d767adab89d2e6668188a7aaee3b8a9d9da5cf3bb7bfa2d9d05f8c9f9fa5c860a2aba7a8c734bcbf87d6f743baf097ccee3cbbb08a9ab57e838bb990aa4e96b083bad354adec8598c76898b2fe97f564a7aefd86e53991ec85add949aaeca5b4b363838e88b1cc7bb089b983f36fa8b281d2bb73a2efb6d4d36ba7b5aea6dc37e2a3; WM_TID=KaKq1aOs26JAUARRQEJtfY6s13CDApxk';
    // 首页获取html
    } else if (type==='index'){
        options.path='/m'+(path||'');
        options.method='GET';
        options.headers.Accept='text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8';
    }
    return options;
}

/*async function get(url){
    return new Promise((resolve,reject)=>{
        https.get(url,res=>{
            let data='';
            res.on('data',chunk=>{
                data+=chunk;
            });
            res.on('end',err=>{
                if (err) reject(err);
                resolve(data);
            });
        }).on('error',e=>{
            console.error(e);
            reject(e);
        });
    });
}*/

async function getAjaxData(path){
    // 获取普通接口所用的通用postdata
    const postData='params=glFEqcF3L0TLHKj2N%2B%2Bpr273l7vsWXIUipM%2BcszLd%2Fk%3D&encSecKey=dbdcd74d72aff5fabb4aacbe791529240b4c7150cc7652e28b031cad70232ba8c6c565bf3c3f85bb9f49940067245698babe43b3d9d4d57066a6d1186488203fbdb03a3cfdfd9db6eafb4c76623f5c6f6d0b1cbf70a8002fa74cc9e8fb43528d56f679b87f8d040fab4b7eecba8151fc05e2c236e2dd868d987ab149424eccdb';
    let options=getOptions('general',path);
    let json=await request(options,postData);
    return json;
}
async function postAjaxData(path,params){
    let str=getSearchPostData(params);
    let options=getOptions('params',path,str.length);
    return await request(options,str);
}

async function request(options,postData){
    return new Promise((resolve,reject)=>{
        const req=https.request(options,res=>{
            let arr=[];
            res.on('data',chunk=>{
                arr.push(chunk);
            });
            res.on('end',err=>{
                if (err) reject(err);
                let data=Buffer.concat(arr).toString();
                resolve(data);
            });
        });
        req.on('error',e=>{
            console.error(e);
            reject(e);
        });
        /*const req=https.request(options,res=>{
            let data='';
            res.on('data',chunk=>{
                data+=chunk;
            });
            res.on('end',err=>{
                if (err) reject(err);
                resolve(data);
            });
        });
        req.on('error',e=>{
            console.error(e);
            reject(e);
        });*/
        postData&&req.write(postData);
        req.end();
    });
}

function getSearchPostData(params,needJson){
    const encSecKey= "28908586dd55e0d591a92f8c26ac541a0a0079dad5efa204fabaa98f235c224c186114bd33b8b62bbd4844c11b2fd914857fb7e3b948c81dd9351d23d2a1c179d845960564914a7a4a6341457a11d8c62cb5f3d726134800608fb43ee18106085e6e40de9259acf9e48c6c176d5a03cd25762ebd3b28d653db56a95023056f7b";
    const firstKey="0CoJUm6Qyw8W8jud";
    const secondKey= "QOAbTgk23RgXa7kr";
    const iv = '0102030405060708';
    let result1=aesEncrypt(JSON.stringify(params),firstKey,iv);
    let result2=aesEncrypt(result1,secondKey,iv);
    let postData={
        params:result2,
        encSecKey
    }
    return needJson?postData:querystring.stringify(postData);
}