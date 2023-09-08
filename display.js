// A $( document ).ready() block.
$(document).ready(function () {
    console.log("ready!");

    let dataSet

    chrome.storage.local.get('tweets_ds', ({tweets_ds}) => {
        dataSet = Object.values(tweets_ds)
        console.log('dataSet', dataSet);

        const tweets = [];
        dataSet.forEach((dd)=>{
             // const sdsd ={...dd.tweets.map((ii)=>({...ii, sessionId: dd.session, sessionDate: dd.date, sessionUrl: dd.url}))}
            // console.log('sdsd', sdsd)
            tweets.push(...dd.tweets.map((ii)=>({...ii, sessionId: dd.session, sessionDate: dd.date,
                sessionUrl: decodeURI(dd.url).replace('https://twitter.com', '')})) );
        })
        const mappedTweets = tweets.map((d)=>({...d , ownerId:  d.owner.id, time: d.time || ''}))
        console.log('data', tweets);
        prepareTable(mappedTweets);
    });

    function prepareTable(dataSet) {
        new DataTable('#tweetList', {
            ordering: true,
            "pageLength": 100,
            dom: 'Bfrtip',
            buttons: [
                'excel'
            ],
            columns: [
                {title: 'post', data: 'post', className: 'rtl'},
                {title: 'owner', data: 'ownerId'},
                {title: 'time', data: 'time'},
                {title: 'session', data: 'sessionId'},
                {title: 'session URL', data: 'sessionUrl'},

            ],
            data: dataSet
        });
    }
});
