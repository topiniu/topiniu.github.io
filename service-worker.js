this.addEventListener('install', function(e){
  e.waitUntil(
    caches.open('v1').then(function(cache){
      return cache.addAll([
        '/index.html',
        '/main.js',
        '/2.js',
        '/3.js'
      ])
    })
  )
})

this.addEventListener('fetch', function(e){
  e.respondWith(
    //检查cache里是否相符合的资源，有的话返回缓存的内容，没有则继续
    caches.match(e.request).then(function(re){
      if(re){
        return re
      }

      //克隆请求
      var request = e.request.clone();
      return fetch(request).then(function(httpRes){
        //请求失败直接返回
        if(!httpRes || httpRes.status !== 200){
          return httpRes
        }

        //请求成功，缓存请求过来的资源文件
        var rc = httpRes.clone();
        caches.open('v1').then(function(cache){
          cache.put(e.request, rc)
        })

        return httpRes
      })
    })
  )
})