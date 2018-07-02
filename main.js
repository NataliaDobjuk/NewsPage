'use strict';
class News {
 constructor(title ,date ,img ,description) {
      this.title = title;
      this.date = date;
      this.img = img;
      this.description = description;
    }
}

var httpGet = function() {

    return new Promise(function(resolve, reject) {

        var url="db.json";
        var xhr = new XMLHttpRequest();

      xhr.withCredentials = true;
      xhr.open('GET', url, true);
  
      xhr.onload = function() {
        if (this.status == 200 ) {
          resolve(this.response);
        } else {
          var error = new Error(this.statusText);
          error.code = this.status;
          reject(error);
        }
      };
  
      xhr.onerror = function() {
        reject(new Error("Network Error"));
      };
  
      xhr.send();
    });
}

var  DataModule = (function () {

    var AllNews= [];

    _getNews();

    function _getNews(){
        httpGet().then(
            result => {
                JSON.parse(result)
                .filter((item) => typeof item == 'object')
                .map((item) => {
                    AllNews.push(new News(item.title, item.date, item.img, item.description));
                })
            }, error => {
                console.log(error.message);
            }
        )
    }
    return {
        AllNews: AllNews
    };

})();
//

    var DomModule = (function () {

    
        var _container = document.getElementById("container");
        var _scrollButton = document.getElementById("down");
        
        function _addScrollEvent() {
            _scrollButton.addEventListener("click", _scrollDown); 
        }
        _addScrollEvent();
    
        function _scrollDown() {
            window.scrollTo(0, document.body.scrollHeight);
         }
        function render(news) {
            var template =`
        <div class="news-block">
                    <div class="image-area">
                        <img src="${news.img}">  
                    </div>
                    <div class="content centered-container">
                        <div class="left-side">
                                <div class="date">
                                        <date>${news.date.toUpperCase()}</date>
                                </div>
                        </div>
                        <div class="right-side">
                                <div class="news-title">
                                        <h2>
                                            ${news.title}
                                        </h2>
                                </div>
                                <div class="description">
                                        <p>
                                            ${news.description}
                                        </p>
                                        <video class="video" poster="${news.img}" controls></video>
                                </div>
                                
                        </div>
                    </div>
                </div>
        `;
    
            _container.innerHTML += template;
        }
      
        return {
            render: render,
        };
    
    })();


document.onreadystatechange = function()
{
    if (document.readyState === 'complete')
    {
        var news = DataModule.AllNews;
        for(var i = 0; i< news.length; i++) {
        DomModule.render(news[i]);  
        }
    }
};
    

