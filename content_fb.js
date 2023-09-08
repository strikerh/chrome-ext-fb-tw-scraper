class autoScrolling {


    fps = 100;
    speedFactor = 0.004;
    minDelta = 0.5;
    autoScrollSpeed = 10;
    autoScrollTimer = null;
    restartTimer = null;
    isScrolling = false;
    prevPos = null;
    currentPos = null;
    currentTime = null;
    prevTime = null;
    timeDiff = null;
    stopScrolling = true;

    constructor() {
        this.init();
    }

    init() {


        window.addEventListener("scroll", (e) => {
            // window.pageYOffset is the fallback value for IE
            this.currentPos = window.scrollY || window.pageYOffset;
        });

        window.addEventListener("wheel", this.stopScroll);
        window.addEventListener("touchmove", this.stopScroll);
        // this.setAutoScroll(60);

    }

    handleManualScroll() {
        const this_ = window.autoScroll
        // window.pageYOffset is the fallback value for IE
        this_.currentPos = window.scrollY || window.pageYOffset;
        clearInterval(this.autoScrollTimer);
        if (this_.restartTimer) {
            clearTimeout(this.restartTimer);
        }
        this_.restartTimer = setTimeout(() => {
            this_.prevTime = null;
            // this_.setAutoScroll();
        }, 50);
    }

    stopScroll() {
        const this_ = window.autoScroll

        clearInterval(this_.autoScrollTimer);
        clearTimeout(this_.restartTimer);
        this_.currentTime = null;
        this_.prevTime = null;
    }

    toggle() {
        this.stopScrolling = !this.stopScrolling;
        if (!this.stopScrolling)
            this.setAutoScroll(100)
        else {
            clearInterval(this.autoScrollTimer);
            clearTimeout(this.restartTimer);
            // this.autoScrollTimer = null;
            // this.restartTimer = null;
            // this.isScrolling = false;
            // this.prevPos = null;
            // this.currentPos = null;
            this.currentTime = null;
            this.prevTime = null;
            // this.timeDiff = null;

        }

    }

    setAutoScroll(newValue) {
        if (newValue) {
            this.autoScrollSpeed = this.speedFactor * newValue;
        }
        if (this.autoScrollTimer) {
            clearInterval(this.autoScrollTimer);
        }
        this.autoScrollTimer = setInterval(() => {
            this.currentTime = Date.now();
            if (this.prevTime) {
                if (!this.isScrolling) {
                    this.timeDiff = this.currentTime - this.prevTime;
                    this.currentPos += this.autoScrollSpeed * this.timeDiff;
                    if (Math.abs(this.currentPos - this.prevPos) >= this.minDelta) {
                        this.isScrolling = true;
                        window.scrollTo(0, this.currentPos);
                        this.isScrolling = false;
                        this.prevPos = this.currentPos;
                        this.prevTime = this.currentTime;
                    }
                }
            } else {
                this.prevTime = this.currentTime;
            }
        }, 1000 / this.fps);
    }


}


class content_fb {


// content_fb.js
    posts = {};
    sessionCode = Math.round(Math.random() * 10000000000);
    pageUrl = location.href;
    lastScroll = 0
    startDate = new Date();

    intervalCode = 0;

    isActive = false;

    autoScroll


// ON RECEIVE MESSAGE

    constructor() {
        if (location.href.includes('facebook.com')) {
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
        // console.log('start code', this.isActive)
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


    extractPosts = () => {

        console.log('-------');
        const tweetElements2 = $('div[data-tracking-duration-id]');
        const textContent = tweetElements2.map((d,f)=> f.textContent)
        // console.log('textContent', textContent);
        tweetElements2.each( (index, dom) => {
            const item = $(dom);
            const item_id = dom.dataset.trackingDurationId;
            const sections = $(dom).children()
            const textContent_s = sections.map((d,f)=> f.textContent)
            // console.log('section_textContent',textContent_s)
/*            sections.each(function (i, g) {
                // console.log('g ' + i , $(g).find('div[data-mcomponent]'))

                const section_textContent = $(g).textContent
                const sdf = $(g).find('div[data-mcomponent]')
                const sdf2 = sdf.filter((q, w) => w.dataset.mcomponent !== 'MContainer').map((f, d) => {
                    return {
                        mComponent: d.dataset.mcomponent,
                        textContent: section_textContent,
                        text: d.dataset.mcomponent === 'ServerTextArea' ? d.textContent : '',
                        image: d.dataset.mcomponent === 'ServerImageArea' ? d.innerHTML : '',
                        dom: d,

                    };
                });
                // console.log('id: ' + item_id + ' section ' + i, sdf2);
                if (i === 0 && sdf2[1].text) {
                    // console.log('id: ' + item_id + ' section ' + i, sdf2[1].text);
                }


            })*/
            // console.log('-');
            // console.log('sdf ' + item_id, sdf);
            const translateY = '';
            const post = textContent_s[1];
            /*.css-901oao.r-1nao33i.r-37j5jr.r-a023e6.r-16dba41.r-rjixqe.r-bcqeeo.r-bnwqim.r-qvutc0*/
            const owner = {}; //css-901oao.r-18jsvk2.r-37j5jr.r-1inkyih.r-16dba41.r-135wba7.r-bcqeeo.r-bnwqim.r-qvutc0
            try {
                owner.name = sections[0].children[0].children[1].children[0].textContent;
            } catch (e) {
                owner.name = '';
            }
            owner.id = '';
            // owner.verified = $(this).find('.css-901oao.css-16my406.r-1awozwy.r-xoduu5.r-poiln3.r-bcqeeo.r-qvutc0');
            owner.url = '';
            const regex = /([^a-zA-Z0-9 ,]+)/g;
            let time = '';
            try {
                 time = sections[0].children[0].children[1].children[1].textContent.replace(regex, '');
            } catch (e) {

            }


            this.posts['t' + item_id] = {
                cont: textContent_s,
                text: dom.textContent,
                time,
                item_id,
                post,
                owner

            };
        })

        // console.log('posts' , this.posts) ;

    }

    handleScroll = () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            if ((window.innerHeight + window.scrollY) > this.lastScroll + 350) {

                this.lastScroll = (window.innerHeight + window.scrollY);
                this.extractPosts();

                chrome.runtime.sendMessage({
                    action: 'storeTweets',
                    session: this.sessionCode,
                    date: this.startDate,
                    url: this.pageUrl,
                    tweets: this.posts
                });

            }
        }

    }

    doSomething = () => {
        console.log('URL change detected!');
        chrome.runtime.sendMessage({action: 'newSession'});
        this.posts = {};
        this.sessionCode = Math.round(Math.random() * 10000000000);
        this.pageUrl = location.href;
        this.startDate = new Date()
        this.lastScroll = 0
    }


}

///////////////////////////////////////////////

if (location.href.includes('facebook.com')) {
    let c = new content_fb();
}
