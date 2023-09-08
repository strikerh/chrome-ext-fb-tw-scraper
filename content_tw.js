class content_tw {


tweets = {};
sessionCode = Math.round(Math.random() * 10000000000);
pageUrl = location.href;
lastScroll = 0
startDate = new Date();

intervalCode = 0;

isActive = false;

 autoScroll


// ON RECEIVE MESSAGE

constructor(){
    if (location.href.includes('twitter.com')) {
        chrome.storage.local.get('is_active', ({is_active}) => {

            this.isActive = is_active;
            this.startCode()

        })

        chrome.storage.local.onChanged.addListener((changes) => {
            if (changes.hasOwnProperty('is_active')) {
                this.isActive = changes.is_active.newValue
                this.startCode()
            }
        })


    }

}


 startCode = () => {
    this.autoScroll = new autoScrolling()
    window.autoScroll = this.autoScroll;
    // console.log('start code', isActive)
    if (this.isActive) {
        window.addEventListener('scroll', this.handleScroll);

        let currentUrl = location.href;

        this.intervalCode = setInterval(() => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                this.doSomething();
            }
        }, 1000);

    } else {
        try {
            window.removeEventListener('scroll');

        } catch (e) {

        }
        clearInterval(this.intervalCode)
    }

}


 extractTweets = () => {

console.log('-------');
    const tweetElements2 = $('div[data-testid="cellInnerDiv"]');
    tweetElements2.each( (index, dom) => {
        const item = $(dom)[0];
        const item_id = $(dom).find('.css-1dbjc4n article').attr('aria-labelledby');
        const translateY = item.style.transform.replace('translateY(', '').replace(')', '');
        const post = $(dom).find('.css-901oao.r-37j5jr.r-16dba41.r-bcqeeo.r-bnwqim.r-qvutc0').text();
        /*.css-901oao.r-1nao33i.r-37j5jr.r-a023e6.r-16dba41.r-rjixqe.r-bcqeeo.r-bnwqim.r-qvutc0*/
        const owner = {}; //css-901oao.r-18jsvk2.r-37j5jr.r-1inkyih.r-16dba41.r-135wba7.r-bcqeeo.r-bnwqim.r-qvutc0
        owner.name = $(dom).find('.css-901oao.r-1awozwy.r-1nao33i.r-6koalj.r-37j5jr.r-a023e6.r-b88u0q.r-rjixqe.r-bcqeeo.r-1udh08x.r-3s2u2q.r-qvutc0').text();
        owner.id = $(dom).find('.css-1dbjc4n.r-18u37iz.r-1wbh5a2.r-13hce6t a.css-1dbjc4n.r-1wbh5a2.r-dnmrzs').text();
        // owner.verified = $(dom).find('.css-901oao.css-16my406.r-1awozwy.r-xoduu5.r-poiln3.r-bcqeeo.r-qvutc0');
        owner.url = $(dom).find('.css-1dbjc4n.r-1wbh5a2.r-dnmrzs a')[0] ? $(dom).find('.css-1dbjc4n.r-1wbh5a2.r-dnmrzs a')[0].href : '';
        const time = $(dom).find('time').attr('dateTime');


        this.tweets['t' + translateY] = {
            cont: item,
            text: $(dom).text(),
            time,
            item_id,
            post,
            owner
        };
    })

    // console.log('tweets' , tweets) ;

}

 handleScroll = () => {

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if ((window.innerHeight + window.scrollY) > this.lastScroll +350) {
            this.lastScroll = (window.innerHeight + window.scrollY);
            this.extractTweets();

            chrome.runtime.sendMessage({
                action: 'storeTweets',
                session: this.sessionCode,
                date: this.startDate,
                url: this.pageUrl,
                tweets: this.tweets
            });

        }
    }

}

 doSomething = () => {
    console.log('URL change detected!');
    chrome.runtime.sendMessage({action: 'newSession'});
    this.tweets = {};
    this.sessionCode = Math.round(Math.random() * 10000000000);
    this.pageUrl = location.href;
    this.startDate = new Date()
    this.lastScroll = 0
}

}
///////////////////////////////////////////////

if (location.href.includes('twitter.com')) {
    let c = new content_tw();
}


