# transfer-stats [![Build Status](https://travis-ci.org/davej/transfer-stats.svg?branch=master)](https://travis-ci.org/davej/transfer-stats)


> Track download/upload and provide transfer stats


## Install

```
$ yarn add transfer-stats
```

## Usage

```js
const Transfer = require('transfer-stats');
const { relativeTimeThreshold, duration } = require('moment')

const fileSize = 10000; // Filesize (perhaps from content-length header).

const transfer = new Transfer({
    bytesTotal: fileSize
    /*
     * bytesTotal is not required but many stats will 
     * be unavailable if it is not specified
     */
});
transfer.start();

// Once transfer is started you can also call `transfer.pause()`
// and `transfer.resume()` to pause/resume the transfer

setTimeout(() => {
    // 100 bytes have been transferred
    transfer.updateBytes(100);

    console.log(`${duration(transfer.stats.msRemaining).humanize()} remaining`);
    // => 30 seconds remaining

    console.log(transfer.stats);
    // =>
    //   {
    //   	"started": true,
    //   	"finished": false,
    //   	"bytesTotal": 10000,
    //   	"bytesCompleted": 100,
    //   	"startDateTime": 1509538897032,
    //   	"percentage": 0.01,
    //   	"bytesRemaining": 9900,
    //   	"msElapsed": 304,
    //   	"bytesPerSecond": 328.94736842105266,
    //   	"msTotal": 30500,
    //   	"msRemaining": 30195
    //   }

    setTimeout(() => {
        // Transfer has completed
        transfer.updateBytes(10000);
        transfer.finish();

        console.log(transfer.stats);
        // =>
        //   {
        //   	"started": false,
        //   	"finished": true,
        //   	"bytesTotal": 10000,
        //   	"bytesCompleted": 10000,
        //   	"startDateTime": 1509539150595,
        //   	"endDateTime": 1509539151814,
        //   	"percentage": 1,
        //   	"bytesRemaining": 0,
        //   	"msElapsed": 1219,
        //   	"bytesPerSecond": 8203.445447087777,
        //   	"msTotal": 1218,
        //   	"msRemaining": 0
        //   }
    }, 900);
}, 300);


```

## License

[MIT](./LICENSE)
