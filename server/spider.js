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

// 与cookie也无关
// let cookieNum=0;
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
        options.path=path;
        // options.headers['Connection']='keep-alive';
        options.headers['Referer']='https://music.163.com/m/song?id=1323303094'

        options.headers['Content-Length']=contentLength;
        options.headers['Cookie']='_iuqxldmzr_=32; _ntes_nnid=917555d20530d5051254730b97d64f8a,1540438527791; _ntes_nuid=917555d20530d5051254730b97d64f8a; abt=5; __utmc=94650624; __utmz=94650624.1540777569.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); playerid=64144041; __utma=94650624.1987073821.1540777569.1540777569.1540781568.2; JSESSIONID-WYYY=dyIdYgx%5CtJmQZC7b%2BT1RlIhojSDBMjgqKDqBTDrbE0m6Vl1ut%2F3tSee8ClTismWW88E6nvT%5C%5C5v1EIQDFNb360Kp7MlbWWAs0qeFYjCaeEoCUtoed5OxRWCooNQ%5CGDa%2FCfpg%5CU3%2B3nHN48ESQrPxl%2BPZrbHT50MTS2M6j42%5Cb%2FUoCTUE%3A1540796778991; WM_NI=reHqTmouG1gnCXiIo1JCSDL1uan8MUHAQDETbuiGD8xaI5tIz0Y%2Bo0ypFy6vAUwo%2BFVpMYPXo4KwDlTn2vvher3ef3S4KLZCj4kS0iARHPIqlWwbpednO18yb1z3PaekbEY%3D; WM_NIKE=9ca17ae2e6ffcda170e2e6eed2ee6fa6b9e5ccf27f9ab88bb6d55a838f8eabbb6a8eaac08ded5d819bfbd1f62af0fea7c3b92ab2bb8892d767adab89d2e6668188a7aaee3b8a9d9da5cf3bb7bfa2d9d05f8c9f9fa5c860a2aba7a8c734bcbf87d6f743baf097ccee3cbbb08a9ab57e838bb990aa4e96b083bad354adec8598c76898b2fe97f564a7aefd86e53991ec85add949aaeca5b4b363838e88b1cc7bb089b983f36fa8b281d2bb73a2efb6d4d36ba7b5aea6dc37e2a3; WM_TID=KaKq1aOs26JAUARRQEJtfY6s13CDApxk';

        // let cookie=[];
        // cookie[cookie.length]='abt=9; JSESSIONID-WYYY=tdbWdSlEB09O8iBQS7dtjO9WpPw0nc%2Fb%2Fqi2whUvvUEXpcDh7s%5CTt5%2Fww1P3Ap%2F1zEIdwu4dyFX1yc9dGrZa94Mc%5CD%2FBJ1UWNnPk7Z%2F8QxEVD%5CqqsFZg3G3Y7RrRefpvdhDBdqnEC2ZFNzXRpJ41qYCpWYautnguFK0IazP8FugJZwSw%3A1542946099369; _iuqxldmzr_=32; _ntes_nnid=a46029c62e4cf9a16580be418254d8ed,1542944299390; _ntes_nuid=a46029c62e4cf9a16580be418254d8ed; WM_NI=318RSi8VslDcyaqQPFhxOOB3ofPmLaELX1%2B%2FcjoR3B0MoQ5fgKYok2Ds6Xhkf1FtolNU2S9G1pY4xS7%2B794i7qUi7hW5GJoi%2FHfkQSHcBvX%2B2UFVF9P4CJX1xrgN8pPudUU%3D; WM_NIKE=9ca17ae2e6ffcda170e2e6eed0d741f69cab9baa5cba9a8ba2c84b879f9bbab845a5aff78ed66a91e9828ed22af0fea7c3b92af1eff8b3d263fc8abd8dc769bbbfbfb2d34eaca881b0c139adbaa08ecf6b879498d2aa25a1b6a1b3b24af493a1b2b86ea5959790ea3a88adfab9eb61a6ef8a95ee688e8bfeb4bc4df3b097d5fb59f5f5f9dab763f5af9b8ab66495eb89abee63ed98aa8cd4598cbd8e97db21f28b8ab7c53394ec8dabdb3bbcaea9afbb7c94abacb6d837e2a3; WM_TID=Rn4yaRsTCN5AEFQUEUJoK1rtyHOT%2BJ3G'
        // cookie[cookie.length]='_iuqxldmzr_=32; _ntes_nnid=917555d20530d5051254730b97d64f8a,1540438527791; _ntes_nuid=917555d20530d5051254730b97d64f8a; abt=5; __utmc=94650624; __utmz=94650624.1540777569.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); playerid=64144041; __utma=94650624.1987073821.1540777569.1540777569.1540781568.2; JSESSIONID-WYYY=dyIdYgx%5CtJmQZC7b%2BT1RlIhojSDBMjgqKDqBTDrbE0m6Vl1ut%2F3tSee8ClTismWW88E6nvT%5C%5C5v1EIQDFNb360Kp7MlbWWAs0qeFYjCaeEoCUtoed5OxRWCooNQ%5CGDa%2FCfpg%5CU3%2B3nHN48ESQrPxl%2BPZrbHT50MTS2M6j42%5Cb%2FUoCTUE%3A1540796778991; WM_NI=reHqTmouG1gnCXiIo1JCSDL1uan8MUHAQDETbuiGD8xaI5tIz0Y%2Bo0ypFy6vAUwo%2BFVpMYPXo4KwDlTn2vvher3ef3S4KLZCj4kS0iARHPIqlWwbpednO18yb1z3PaekbEY%3D; WM_NIKE=9ca17ae2e6ffcda170e2e6eed2ee6fa6b9e5ccf27f9ab88bb6d55a838f8eabbb6a8eaac08ded5d819bfbd1f62af0fea7c3b92ab2bb8892d767adab89d2e6668188a7aaee3b8a9d9da5cf3bb7bfa2d9d05f8c9f9fa5c860a2aba7a8c734bcbf87d6f743baf097ccee3cbbb08a9ab57e838bb990aa4e96b083bad354adec8598c76898b2fe97f564a7aefd86e53991ec85add949aaeca5b4b363838e88b1cc7bb089b983f36fa8b281d2bb73a2efb6d4d36ba7b5aea6dc37e2a3; WM_TID=KaKq1aOs26JAUARRQEJtfY6s13CDApxk'
        // cookie[cookie.length]='abt=87; JSESSIONID-WYYY=o7xSqec69yy1rHdPW55cctaJIboGNvkw%2F0Q0pRnRwgk0ePVtPHi%5Cgl9MKZ6u%5C6cF%2FFiDpUNMAq7z2EACXYl7mc9uQ5NuqvatVxvBrsaEiG%2FeZDy%2B9Pf2l0fXNn9Mz%2BsNr5CRlBrG5Bz3GAfVasBu%2BcW8gK8f1KuwcCK85PEjIZkW2Ihe%3A1542944405648; _iuqxldmzr_=32; _ntes_nnid=e53880e1e860c99343a2d02d94b6ac93,1542942605670; _ntes_nuid=e53880e1e860c99343a2d02d94b6ac93'
        // cookie[cookie.length]='abt=87; _iuqxldmzr_=32; _ntes_nnid=e53880e1e860c99343a2d02d94b6ac93,1542942605670; _ntes_nuid=e53880e1e860c99343a2d02d94b6ac93; WM_NI=7XUW%2FTU3%2FHE4WYzVleVeD4YpehhAvNKhC%2FbDpH2lODEQ%2BlWV9Dxtc4Xrm7jLq4R378XSUBvyb4c8ZBrZRotvYPsfEjCQtNmbB7pX%2BWGpLfrYoL3peH0sVyRczs%2Bq7U7HaXE%3D; WM_NIKE=9ca17ae2e6ffcda170e2e6eeadd14af48b9d86eb3ffbe78fa6c15f878e9f84f248ace9bd88cc21bc94a5baca2af0fea7c3b92af5889bb8ae6097ede1a9c8409587b6b7ef6f96bb8cd5dc7ca7b8a8a2f54689b88dd0e150b498fe8dce50878fe58dd65efb9cb895e2409caea3d8e948b3ec9ed4b6349c8d9ba3f573a2ecadd9d94ab2869e90f77e9b90bd87c862818fbcaff06a82e9c0b9aa5d85b08487f153ad94fd91e844f4ad9a9ad169baade592b65ff598afb9c837e2a3; WM_TID=5Vu%2FaaaQ9KtFFFUBRBdtLw78kcuhbkdP; JSESSIONID-WYYY=%2FOQ8w4xkZl1V8tBdGNpvhAas81OCdTT3aw8ZVVMHTuytEudZawptSDvBRmdY%2BgFdxqhx8zAklAp%2F2BwU2%2B27Uh1JDSQP%5CmZQBnpBxsRO7QA%2BOFmBmnD7rdwZuFOvEINvEjAFTIT2pWOsKhBXcTasrE6jUz4OTt7tB%2BaNsC7l2FY6snFm%3A1542944653990'
        // cookie[cookie.length]='abt=40; JSESSIONID-WYYY=qsQN%5CtpSlBMDS1%2FfI%5Co%2BHiwy0hvjbwQ1fVtGVA9qilwhPlZ6pKhFY7BJUOKFHiXJfbyAVlSPsJRn3CceAK88OZBOrbJUI2vGOjOXRn59V1y%2FTU6zjY6BOyS%5C13HI8aW9QOPkv4nnW8PKvoDeCIPZ7l5vCHD1FBAN%2F5v4o4pF4NzmeFM%2B%3A1542946019183; _iuqxldmzr_=32; _ntes_nnid=b3af38fba5d88a4eb7cd78905a02d5f2,1542944219206; _ntes_nuid=b3af38fba5d88a4eb7cd78905a02d5f2'
        // cookie[cookie.length]='abt=39; JSESSIONID-WYYY=Ck4QffqShZFp0nhNFGpot31te8A5v5Jk1KAr%5C%2BsmKbYU6Ss91%5Cc6Dcgaqu%2Bj6o9%2FbHj3oSlUXyw7FKxtN%2F9s0cM2uqgMk7r6K%2Bm0TjzFCZozHTe%5C78AJnYVYp8N1k7JZ%2BcXEIthaXq9kZOUNC9SNx3brc9ejpEpNJEvFIRHF2bpTV2IO%3A1542946533077; _iuqxldmzr_=32; _ntes_nnid=118e573f7c9726cdcfe27a9cb80a04a1,1542944733099; _ntes_nuid=118e573f7c9726cdcfe27a9cb80a04a1';
        // cookie[cookie.length]='abt=70; JSESSIONID-WYYY=POBXMYmnVsJUArcCD4R%5CJ8ExbJdmEddXl6PM8NHpe%2FypPij1ltq%2Fs6RBOn%5C68GblyvrVwrXO9YjlsKbEioOMAweJUkxtUKMyTlAUrcCJkEQz5y5JdUBkjBKOSangBO3f4R0D3kr96u7WVfwJZYnSk0K%2BfFXnDHh%5CwnvgabEGCe16297S%3A1542946576029; _iuqxldmzr_=32; _ntes_nnid=d198eb132bcb58b2271a29d79b1cc8bb,1542944776053; _ntes_nuid=d198eb132bcb58b2271a29d79b1cc8bb; WM_NI=GrSDhW4i%2BOsKk%2BH9AP8N0vIvQtksPDyiNUpeyCnKfKtFqowiVmZooE7U%2B2cTmV6rvpB1T4S5du0QKVJmANRGvynKTysXCj3GmazVPRzwzkE%2BdQiMmknm8n8Uk0y6IALVeUI%3D; WM_NIKE=9ca17ae2e6ffcda170e2e6eeb6f54f85f0b68ab462f2928ea3d54f828b8abab75cb0aefc8be459fb9783b6ef2af0fea7c3b92a85ae9da5eb5df8b7e5b0f241a9f588dac45cfc920097cc7e93aca594d350bbb782b6f36fbb9da2ace541b89abf90f66396b39690ee4ff58be5d3e260af8afa93f57c82ef9cd5d23fa8ab00b2ca5e8ab38fafd14db6a7a2acd773b1888d8bb24dafbfb6b7d35abaa9b68cc821a88fa7aef061aeb3f88fbb5fa9f0b7d7cc4b908aabb6cc37e2a3; WM_TID=aC51YSvjGFFEFEFFEEJsK074mOWpMdF0'
        // cookie[cookie.length]='abt=35; JSESSIONID-WYYY=oiS5eJcwrj21JcElW9oa7Fjz8abGBWSJ%2FS%5CMdRYYTe%2B0eQzWPPinjl90h28ui21n%2FspMMUXiAbJztJ5aXhiEaz9EcbWugdahgFRY5sateDAek%5C829%2BzMW0mNw9MMBWCurNmVdBVbmqyzgWddaDeflztABg8fN%5C9UcO%2FkzPETDyQWg1XR%3A1542946602131; _iuqxldmzr_=32; _ntes_nnid=3108cf284803fbc46a643198d615963b,1542944802150; _ntes_nuid=3108cf284803fbc46a643198d615963b; WM_NI=uL0RRcfwOhjXQErk%2FUfmMhHTDCn1hxKw7WO1Q9C%2Fa46LBKUrHQm6BJw1IpxN9AYkJ8KRexJnJ4SIfV31q5aG14d8Efa50KAbYb6cWcgH0ZxqvOFVlAQ0u8JR%2Bz4ktUzAcWI%3D; WM_NIKE=9ca17ae2e6ffcda170e2e6eeb4f85eac99a18ff33aafeb8eb7c45e879f9aaab85cb0aabd9bcf52f3b68698f32af0fea7c3b92ab79400b3d169a6a98189e954939bbe8cae5fa6b38389cb60889da2d2eb7489a9f9b8ce3b93e78dd0e440f6948eacd87a8c8fa3d7c142b5ef8791fb46fb9f978cc934898eab99c9668aec9daae55ef1efbfd6e44df3ecacd9c86ea3eb00acc46a9bbefa84d669a59800bbfb7bb6918ab7ef4b93f0bbd9c95ae9a6fc8cf75fba9fadb8cc37e2a3; WM_TID=e4IG4xSdlPFBVBRQBBIob1%2F4zfMkzc08'
        // options.headers['Cookie']=cookie[cookieNum];
        // console.log('cookieNum:'+cookieNum)
        // cookieNum++;
        // if (cookieNum>=cookie.length){
        //     cookieNum=0
        // }
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

// 以为是这几个key必须在时间内，结果是无关的
// let keyNum=0;
function getSearchPostData(params,needJson){
    const firstKey="0CoJUm6Qyw8W8jud";
    const secondKey=[];
    const encSecKey=[];
    secondKey[0]= "QOAbTgk23RgXa7kr";
    encSecKey[0]= "28908586dd55e0d591a92f8c26ac541a0a0079dad5efa204fabaa98f235c224c186114bd33b8b62bbd4844c11b2fd914857fb7e3b948c81dd9351d23d2a1c179d845960564914a7a4a6341457a11d8c62cb5f3d726134800608fb43ee18106085e6e40de9259acf9e48c6c176d5a03cd25762ebd3b28d653db56a95023056f7b";

    // secondKey[1]= "7rIXnLcJ9V6gPEla";
    // encSecKey[1]="9fc1534d8245cc680dba9b0fb12a57c6f03fad35cafc69a825732636652645c123ebce4b73ce50d345cdc4c0dcfc0c3340826d6d9c713105f35ed2c9d7162f8a1be44968eb48d363a250a91d38f5240e3364465cbfd588bdc6c12b447ac69a4cd416c05239c5c31b1c52e64fb41dbd48da310a31457df1e84611bb67a991831e"

    // secondKey[2]="Lh2eIE9WzSrXYXnO"
    // encSecKey[2]="16de787d162222435050fa51f5687c309632a5af28bd143427c23ac7f367072c8412a5033b8c8ace2f99f0b853424d72231a99eef6676f9f7d6900d1bc60509240188ef728f8fe826cc6d0b659fcd5b889e9705cfb2ab78e7929527da50ec675ef02a7b94e7fb412db73489d9a9a3b73bb80a34633393288979e82325184d043"

    // secondKey[3]="eOqgN57mjLWkS3Fm"
    // encSecKey[3]="cf98e21710bb112f53113138ebd6d075b81f47fbf3d07a4f25bcb37a2ecdb17cff4fc3c4e4873f1e78bd835f2ca29cf277f95e40fe1d4d0c3005450b4ab558c74e4cfbcb423a9ae49bc75ab6a0387134e72916d8209534507e04804176166d3fe31431c4ed1f35438c682e69e38bf66b34a93eceb959ef79e903c267602324cc"

    // secondKey[4]="m5zVkVuOntuVDsLt"
    // encSecKey[4]="863e1c222fbda61e6e00029d60a25e65f4a802b44033bccb662f1ecf194a14666da7e97ebcae91d5554a76f0f3a11345d7caebaaecf8d2b5eba0b2ce416a5d5732b24bcdc4550fa2d9c60aeff430234a630d953af559f9bf6dc7aabe0befeffc91bdfc1d9851300d260431c9ac1f4463453e5a7958aeac3bcd4b05760b990d06"

    const iv = '0102030405060708';
    let result1=aesEncrypt(JSON.stringify(params),firstKey,iv);
    let result2=aesEncrypt(result1,secondKey[0],iv);
    let postData={
        params:result2,
        encSecKey:encSecKey[0]
    }
    // console.log('keyNum:'+keyNum);
    // keyNum++
    // if (keyNum>=secondKey.length){
    //     keyNum=0
    // }
    return needJson?postData:querystring.stringify(postData);
}
