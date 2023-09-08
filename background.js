// background.js
console.log('Start background.js')


let isActive = false;
let tweetsDs = null;

// prepare local storage
chrome.storage.local.get('tweets_ds', ({tweets_ds}) => {
    tweetsDs = tweets_ds
});

chrome.storage.local.get('is_active', ({is_active}) => {
    if (is_active === undefined) {
        chrome.storage.local.set({is_active: false});
        isActive = false;
    }
    isActive = is_active;
    saveAllTweets()

})


// ON LOCAL STORAGE CHANGED
chrome.storage.local.onChanged.addListener((changes) => {
    if (changes.hasOwnProperty('is_active')) {
        isActive = changes.is_active.newValue;
    }
    if (changes.hasOwnProperty('tweets_ds')) {
        tweetsDs = changes.tweets_ds.newValue;

    }
})


// ON RECEIVE MESSAGE
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('on message', message)
    if (!isActive) {
        return
    }
    if (message.action === 'storeTweets') {
        const data = {
            date: message.date,
            session: message.session,
            url: message.url,
            tweets: Object.values(message.tweets)
        }

        //  scrapedTweets.push(...message.tweets);
        let dataset = {}
        chrome.storage.local.get('tweets_ds').then((dd) => {
            dataset = dd.tweets_ds || {}
            dataset[message.session] = data;
            chrome.storage.local.set({'tweets_ds': {...dataset}});
        })


    } else if (message.action === 'newSession') {

    } else if (message.action === 'autoScrolling') {
        console.log('on autoScrolling', message)

        // chrome.runtime.sendMessage({ action: "autoScrolling1", data: message.data });




    } else if (message.action === 'log') {
        console.log('log', message.log)

    } else if (message.action === 'downloadCSV') {
        downloadCSV();
        console.log('log', message.log)

    }
});


function storeTweets() {

}


function saveAllTweets() {
    if(!tweetsDs){
        return
    }
    const sessions = Object.values(tweetsDs)
    console.log('downloadCSV', sessions);
    const allTweets = []
    sessions.forEach((ss) => {
        ss.tweets.forEach((tt) => {
            allTweets.push({
                session_date: ss.date,
                session_id: ss.session,
                session_url: ss.url,
                owner_id: tt.owner.id,
                owner_name: tt.owner.name,
                owner_url: tt.owner.url,
                item_id: tt.item_id,
                text: tt.text,
                time: tt.time,
                post: tt.post
            })

        });
    })

    chrome.storage.local.set({all_tweets: allTweets})

}

