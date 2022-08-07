# compensate-playback-time

Forces the HTML5 media player time to be in sync with real time.
Delays caused by a lack of data or slow decoding will be compensated by adjusting the playback speed for small delays and setting the currentTime for bigger ones.

## Installation

Copy `compensate.ts` or `compensate.js` to your project. To use ES6 imports simply add a `export` before the class definition.

## Usage / API

Full example see files `test.html` and `test.ts`

````typescript
const compensator = new Compensator(videoOrAudioElement, {
    // ... options (see JSdoc in code)
})
````
`videoOrAudioElement` extends HTMLMediaElement

---

***IMPORTANT:***

*Do NOT do anything on the media element yourself other than adding eventListeners*

---

````typescript
compensator.play();
````
equivalent to HTMLMediaElement.play()

---

````typescript
compensator.pause();
````
equivalent to HTMLMediaElement.pause()

---

````typescript
console.log(compensator.time)
````
gets the current time in milliseconds

---

````typescript
compensator.time = 5000;
````
sets the current time in milliseconds

---

````typescript
compensator.startFromTheBeginning()
````

---

````typescript
compensator.addEventListener("loopback", cb);
````
fired when the end is reached and `options.loop == true`

---

(c) 2022 Hans Schallmoser - All rights reserved
