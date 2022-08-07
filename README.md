# compensate-playback-time

Forces the HTML5 media player time to be in sync with real time.
Delays caused by a lack of data or slow decoding will be compensated by adjusting the playback speed for small delays and setting the currentTime for bigger ones.

## Installation

Copy `compensate.ts` or `compensate.js` to your project. To use ES6 imports simply add a `export` before the class definition.

## Usage

Full example see files `test.html` and `test.ts`

````typescript
compensator = new Compensator(videoOrAudioElement, {
    // ... options (see JSdoc in code)
})
compensator.play();
compensator.pause();
````

Table 1: Instance properies

|property/method|description|
|---------------|-----------|
|.play()        |equivalent HTMLMediaElement.play()|
|.pause()       |equivalent HTMLMediaElement.pause()|
|.startFromTheBeginning()|self explaining|
|.time          |getter/setter playback time|
