/**
 * 自动引入模板，在原有 sw-precache 插件默认模板基础上做的二次开发
 *
 * 因为是自定导入的模板，项目一旦生成，不支持随 sw-precache 的版本自动升级。
 * 可以到 Lavas 官网下载 basic 模板内获取最新模板进行替换
 *
 */

/* eslint-disable */

'use strict';

var precacheConfig = [["/2024/06/19/hello-world/index.html","c05ed4ed605162cbaccb26d9ef6fae73"],["/404.html","ae245bd25923ba0dec0d58ea694bb54f"],["/about/index.html","1665cd6073f34da31d2a9ef32ae6709d"],["/archives/2024/06/index.html","6a69e86e6cf00ebb5d89aca463a1e795"],["/archives/2024/index.html","928bd67947f6d6b1b9b1cbe1cda848cc"],["/archives/index.html","57a6e7b42232855991041d0deb34c992"],["/css/custom.css","fdb28e92a1622ea85db10113a3bf17d0"],["/css/index.css","bed90571995b01c0a80c8dad495d74e3"],["/css/var.css","d41d8cd98f00b204e9800998ecf8427e"],["/images/background.jpg","c839d02d2cfd29c84db4da8c4539c8e8"],["/images/cover1.jpg","bf3617e7eee2c8f591c6551114813ebe"],["/images/cover2.jpg","18196cd18bb892e61625f86e74c3cc0e"],["/images/cover3.jpg","4572d82aa9776ce9f0799e827171c432"],["/images/cover4.jpg","219b01317c8e27bafd4e791816964bfa"],["/images/cover5.jpg","86d5feafa232547a4e1b3dad15691f64"],["/images/cover6.jpg","0113da86db735f55b7056c22852e0991"],["/images/cover7.jpg","e9739cc522054a30363918c2ffaf8fff"],["/images/fight.png","124d51f444355876f5efb82ddf623499"],["/images/global.png","359749db93f14d030689da17171e52e8"],["/images/head.jpg","bf70e3add7c10d40aec37149d85eaed8"],["/images/head2.jpg","af704e3c588fd32c685516263ee7825c"],["/images/image1.jpg","633b34b42410569a4fa3175cdf90328d"],["/images/image2.jpg","815b2875f34fab3322ce3a570806ad60"],["/images/image3.jpg","248df634f2bcfef286ee5eec1d84dd67"],["/images/image4.jpg","7166bd87d23bb1b9134e71e7a2bab094"],["/images/image5.jpg","7d96c6e83b68d46bd3db5b4d75a2d5ee"],["/images/yueya.png","3ddb6920cf0ccc7383a05323c9b66ecb"],["/img/background.jpg","c839d02d2cfd29c84db4da8c4539c8e8"],["/img/cover1.jpg","bf3617e7eee2c8f591c6551114813ebe"],["/img/cover2.jpg","18196cd18bb892e61625f86e74c3cc0e"],["/img/cover3.jpg","4572d82aa9776ce9f0799e827171c432"],["/img/cover4.jpg","219b01317c8e27bafd4e791816964bfa"],["/img/cover5.jpg","86d5feafa232547a4e1b3dad15691f64"],["/img/cover6.jpg","0113da86db735f55b7056c22852e0991"],["/img/cover7.jpg","e9739cc522054a30363918c2ffaf8fff"],["/img/fight.png","124d51f444355876f5efb82ddf623499"],["/img/global.png","359749db93f14d030689da17171e52e8"],["/img/head.jpg","bf70e3add7c10d40aec37149d85eaed8"],["/img/head2.jpg","af704e3c588fd32c685516263ee7825c"],["/img/image1.jpg","633b34b42410569a4fa3175cdf90328d"],["/img/image2.jpg","815b2875f34fab3322ce3a570806ad60"],["/img/image3.jpg","248df634f2bcfef286ee5eec1d84dd67"],["/img/image4.jpg","7166bd87d23bb1b9134e71e7a2bab094"],["/img/image5.jpg","7d96c6e83b68d46bd3db5b4d75a2d5ee"],["/img/yueya.png","3ddb6920cf0ccc7383a05323c9b66ecb"],["/index.html","86afb9a6b1a5e8e3011dffad90fe9775"],["/js/main.js","960297fafacb19dff1246d71f6dfcf6f"],["/js/search/algolia.js","4491ac1d470a1693a502a9d09034aa21"],["/js/search/local-search.js","9da6b76672a143c8c8449770a8d259f3"],["/js/tw_cn.js","fb4da68124bbafbd2d3da537c80e27ce"],["/js/utils.js","420a15cf446b5670244a9ea05b2bccf0"],["/link/index.html","fbd1d99c3252cbf7d7e397b4bd1f0ddb"],["/movie/index.html","676227469a699ca3db800b11879828a8"],["/music/index.html","7f4ecefe7b5b29bae25ae8679120dae6"],["/sw-register.js","b1e8c4409783310f431f1fcbc1b2d7e7"],["/tags/index.html","beac7683964687715ca9e3f668b29bad"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');
var firstRegister = 1; // 默认1是首次安装SW， 0是SW更新


var ignoreUrlParametersMatching = [/^utm_/];


var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
        url.pathname += index;
    }
    return url.toString();
};

var cleanResponse = function (originalResponse) {
    // 如果没有重定向响应，不需干啥
    if (!originalResponse.redirected) {
        return Promise.resolve(originalResponse);
    }

    // Firefox 50 及以下不知处 Response.body 流, 所以我们需要读取整个body以blob形式返回。
    var bodyPromise = 'body' in originalResponse ?
        Promise.resolve(originalResponse.body) :
        originalResponse.blob();

    return bodyPromise.then(function (body) {
        // new Response() 可同时支持 stream or Blob.
        return new Response(body, {
            headers: originalResponse.headers,
            status: originalResponse.status,
            statusText: originalResponse.statusText
        });
    });
};

var createCacheKey = function (originalUrl, paramName, paramValue,
    dontCacheBustUrlsMatching) {

    // 创建一个新的URL对象，避免影响原始URL
    var url = new URL(originalUrl);

    // 如果 dontCacheBustUrlsMatching 值没有设置，或是没有匹配到，将值拼接到url.serach后
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
        url.search += (url.search ? '&' : '') +
            encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
};

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // 如果 whitelist 是空数组，则认为全部都在白名单内
    if (whitelist.length === 0) {
        return true;
    }

    // 否则逐个匹配正则匹配并返回
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function (whitelistedPathRegex) {
        return path.match(whitelistedPathRegex);
    });
};

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // 移除 hash; 查看 https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // 是否包含 '?'
        .split('&') // 分割成数组 'key=value' 的形式
        .map(function (kv) {
            return kv.split('='); // 分割每个 'key=value' 字符串成 [key, value] 形式
        })
        .filter(function (kv) {
            return ignoreUrlParametersMatching.every(function (ignoredRegex) {
                return !ignoredRegex.test(kv[0]); // 如果 key 没有匹配到任何忽略参数正则，就 Return true
            });
        })
        .map(function (kv) {
            return kv.join('='); // 重新把 [key, value] 格式转换为 'key=value' 字符串
        })
        .join('&'); // 将所有参数 'key=value' 以 '&' 拼接

    return url.toString();
};


var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
        url.pathname += index;
    }
    return url.toString();
};

var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
    precacheConfig.map(function (item) {
        var relativeUrl = item[0];
        var hash = item[1];
        var absoluteUrl = new URL(relativeUrl, self.location);
        var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
        return [absoluteUrl.toString(), cacheKey];
    })
);

function setOfCachedUrls(cache) {
    return cache.keys().then(function (requests) {
        // 如果原cacheName中没有缓存任何收，就默认是首次安装，否则认为是SW更新
        if (requests && requests.length > 0) {
            firstRegister = 0; // SW更新
        }
        return requests.map(function (request) {
            return request.url;
        });
    }).then(function (urls) {
        return new Set(urls);
    });
}

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return setOfCachedUrls(cache).then(function (cachedUrls) {
                return Promise.all(
                    Array.from(urlsToCacheKeys.values()).map(function (cacheKey) {
                        // 如果缓存中没有匹配到cacheKey，添加进去
                        if (!cachedUrls.has(cacheKey)) {
                            var request = new Request(cacheKey, { credentials: 'same-origin' });
                            return fetch(request).then(function (response) {
                                // 只要返回200才能继续，否则直接抛错
                                if (!response.ok) {
                                    throw new Error('Request for ' + cacheKey + ' returned a ' +
                                        'response with status ' + response.status);
                                }

                                return cleanResponse(response).then(function (responseToCache) {
                                    return cache.put(cacheKey, responseToCache);
                                });
                            });
                        }
                    })
                );
            });
        })
            .then(function () {
            
            // 强制 SW 状态 installing -> activate
            return self.skipWaiting();
            
        })
    );
});

self.addEventListener('activate', function (event) {
    var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.keys().then(function (existingRequests) {
                return Promise.all(
                    existingRequests.map(function (existingRequest) {
                        // 删除原缓存中相同键值内容
                        if (!setOfExpectedUrls.has(existingRequest.url)) {
                            return cache.delete(existingRequest);
                        }
                    })
                );
            });
        }).then(function () {
            
            return self.clients.claim();
            
        }).then(function () {
                // 如果是首次安装 SW 时, 不发送更新消息（是否是首次安装，通过指定cacheName 中是否有缓存信息判断）
                // 如果不是首次安装，则是内容有更新，需要通知页面重载更新
                if (!firstRegister) {
                    return self.clients.matchAll()
                        .then(function (clients) {
                            if (clients && clients.length) {
                                clients.forEach(function (client) {
                                    client.postMessage('sw.update');
                                })
                            }
                        })
                }
            })
    );
});



    self.addEventListener('fetch', function (event) {
        if (event.request.method === 'GET') {

            // 是否应该 event.respondWith()，需要我们逐步的判断
            // 而且也方便了后期做特殊的特殊
            var shouldRespond;


            // 首先去除已配置的忽略参数及hash
            // 查看缓存简直中是否包含该请求，包含就将shouldRespond 设为true
            var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
            shouldRespond = urlsToCacheKeys.has(url);

            // 如果 shouldRespond 是 false, 我们在url后默认增加 'index.html'
            // (或者是你在配置文件中自行配置的 directoryIndex 参数值)，继续查找缓存列表
            var directoryIndex = 'index.html';
            if (!shouldRespond && directoryIndex) {
                url = addDirectoryIndex(url, directoryIndex);
                shouldRespond = urlsToCacheKeys.has(url);
            }

            // 如果 shouldRespond 仍是 false，检查是否是navigation
            // request， 如果是的话，判断是否能与 navigateFallbackWhitelist 正则列表匹配
            var navigateFallback = '';
            if (!shouldRespond &&
                navigateFallback &&
                (event.request.mode === 'navigate') &&
                isPathWhitelisted([], event.request.url)
            ) {
                url = new URL(navigateFallback, self.location).toString();
                shouldRespond = urlsToCacheKeys.has(url);
            }

            // 如果 shouldRespond 被置为 true
            // 则 event.respondWith()匹配缓存返回结果，匹配不成就直接请求.
            if (shouldRespond) {
                event.respondWith(
                    caches.open(cacheName).then(function (cache) {
                        return cache.match(urlsToCacheKeys.get(url)).then(function (response) {
                            if (response) {
                                return response;
                            }
                            throw Error('The cached response that was expected is missing.');
                        });
                    }).catch(function (e) {
                        // 如果捕获到异常错误，直接返回 fetch() 请求资源
                        console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
                        return fetch(event.request);
                    })
                );
            }
        }
    });









/* eslint-enable */
