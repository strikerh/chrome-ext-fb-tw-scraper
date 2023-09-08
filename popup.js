// popup.js
let isScrolling = false;
let isActive = null;
let activeTab = null;
chrome.storage.local.get('tweets_ds', ({tweets_ds}) => {
    displayData(tweets_ds)
});
chrome.storage.local.get('is_active', ({is_active}) => {
    isActive = is_active;
    setActiveBtn(isActive)
});

chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    activeTab = tabs[0];
    console.log(activeTab);
});


document.addEventListener('DOMContentLoaded', function () {
    const downloadBtn = document.getElementById('downloadBtn');
    const viewButton = document.getElementById('viewButton');
    const deleteAllButton = document.getElementById('deleteAllButton');
    const isActiveBtn = document.getElementById('is_active');
    const autoScrollBtn = document.getElementById('autoScroll');


    isActiveBtn.addEventListener('change', function () {

        chrome.storage.local.set({is_active: isActiveBtn.checked}).then(() => {
            chrome.storage.local.get('is_active', ({is_active}) => {
                console.log(is_active)
            });
        });
    });

    viewButton.addEventListener('click', function () {
        chrome.tabs.create({url: chrome.runtime.getURL('display.html')});
    });
    deleteAllButton.addEventListener('click', function () {
        chrome.storage.local.set({tweets_ds: null}).then(() => {
            chrome.storage.local.get('tweets_ds', ({tweets_ds}) => {
                displayData(tweets_ds)
            });
        });

    });


    downloadBtn.addEventListener('click', downloadXls);
    autoScrollBtn.addEventListener('click', autoScrolling);
});


chrome.storage.local.onChanged.addListener((changes, namespace) => {
    // chrome.runtime.sendMessage({action: 'log', log: changes.tweets_ds.newValue})
    if (changes.hasOwnProperty('is_active')) {
        isActive = changes.is_active.newValue;
        setActiveBtn(isActive)
    }
    if (changes.hasOwnProperty('tweets_ds')) {
        displayData(changes.tweets_ds.newValue)

    }
})


function displayData(tweets_ds) {

    if (!tweets_ds) {
        const tweetList = document.getElementById('sessionList');
        tweetList.innerHTML = '';
        document.getElementById('emptyData').classList.remove('hidden')
        return
    }
    document.getElementById('emptyData').classList.add('hidden')
    var DateTime = luxon.DateTime;
    //prepare data
    const sessions1 = Object.values(tweets_ds);

    sessions = sessions1.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });

    //chrome.runtime.sendMessage({action: 'log', log: sessions})


    const tweetList = document.getElementById('sessionList');
    tweetList.innerHTML = '';
    sessions.forEach((ss) => {

        const date = DateTime.fromISO(ss.date).toFormat("DD '<small>'( tt )'</small>'");
        const regex = /(https:\/\/(m\.)*facebook\.com\/)/g;
        const innterHtml = `
                <div> ${decodeURI(ss.url).replace('https://twitter.com/', 'TW/').replace( regex , 'FB/')} </div>
            <div class="metas">
                <div class="data">
                    <div><b> sessionId: </b>${ss.session} </div>
                    <div><b>date:</b> ${date}</div>
                </div>
                <div class="count">
                    ( ${ss.tweets.length} )    
                </div>
            </div>
        `;


        const li = document.createElement('li');
        li.innerHTML = innterHtml;
        tweetList.appendChild(li);
    });

}

function setActiveBtn(ch) {
    document.getElementById('is_active').checked = ch;
}


function downloadCSV() {
    chrome.storage.local.get('all_tweets').then(({all_tweets}) => {
        // console.log(all_tweets);
        const csvAr = [[
            'session_date',
            'session_id',
            'session_url',
            'owner_id',
            'owner_name',
            'owner_url',
            'item_id',
            'text',
            'time',
            'post']]

        all_tweets.forEach((ss) => {
            csvAr.push([
                ss.session_date,
                ss.session_id,
                ss.session_url,
                ss.owner_id,
                ss.owner_name,
                ss.owner_url,
                ss.item_id,
                encodeURIComponent(ss.text),
                ss.time,
                encodeURIComponent(ss.post)
            ])
        });
        // console.log('csv', csvAr);

        const sd = csvAr.map((row) => row.join(';')).join('\r\n')
        // console.log('csv', sd);


        var uint8 = new Uint8Array(sd.length);
        for (var i = 0; i < uint8.length; i++) {
            uint8[i] = sd.charCodeAt(i);
        }

        const blob = new Blob([uint8], {type: 'text/plain;charset=windows-1256'});
        const url = URL.createObjectURL(blob);


        const a = document.createElement('a');
        a.href = url;
        a.download = 'scraped_data.csv';
        a.click();

        URL.revokeObjectURL(url);
    })

}

function downloadXls() {
    chrome.storage.local.get('all_tweets').then(({all_tweets}) => {
        // console.log(all_tweets.length);

        const filename = 'reports.xlsx';
        const ws = XLSX.utils.json_to_sheet(all_tweets);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "all tweets");
        XLSX.writeFile(wb, filename);

    })

}


function autoScrolling() {
    isScrolling = !isScrolling;
        chrome.scripting.executeScript({
            target: {tabId: activeTab.id},
            function: () => {
                autoScroll.toggle();
            }
        })

}
