"use strict";
// all times in ms
class Compensator extends EventTarget {
    constructor(el, options) {
        super();
        this.el = el;
        this.options = options;
        this.playState = "pause";
        this.playStartRealTime = NaN;
        this.playBaseTime = 0;
        this.cachedTimeShouldBe = NaN; // @debugger
        this.cachedDelta = NaN; // @debugger
        this.cachedSpeed = NaN; // @debugger
        this.timeSetLock = -Infinity;
        setInterval(this.sync.bind(this), options.syncInterval || 30);
        el.addEventListener("ended", () => {
            if (options.loop) {
                this.startFromTheBeginning();
                this.dispatchEvent(new Event("loopback"));
            }
            else {
                this.time = 0;
                el.currentTime = 0;
                this.pause();
            }
        });
    }
    startFromTheBeginning() {
        this.playBaseTime = 0;
        this.playStartRealTime = performance.now();
        this.playState = "play";
        this.el.currentTime = 0;
        this.el.play();
        this.sync();
    }
    pause() {
        if (this.playState == "pause")
            return;
        this.el.pause();
        this.playBaseTime = this.timeMediaShouldBe;
        this.playStartRealTime = NaN;
        this.playState = "pause";
        this.sync();
    }
    play() {
        if (this.playState == "play")
            return;
        this.el.play();
        this.playBaseTime;
        this.playStartRealTime = performance.now();
        this.playState = "play";
        this.sync();
    }
    set time(time) {
        this.playBaseTime = time;
        this.playStartRealTime = performance.now();
        this.sync();
    }
    get time() {
        return this.timeMediaShouldBe;
    }
    get timeMediaShouldBe() {
        if (this.playState == "play") {
            return this.playBaseTime + (performance.now() - this.playStartRealTime);
        }
        else {
            return this.playBaseTime;
        }
    }
    sync() {
        this.cachedTimeShouldBe = this.timeMediaShouldBe;
        /** \+ = player ahead, - = player behind*/
        let delta = this.el.currentTime * 1000 - this.timeMediaShouldBe;
        let absDelta = Math.abs(delta);
        this.cachedDelta = delta;
        if (absDelta > (this.options.methodThreshold || 1000)) {
            // set currentTime
            this.el.playbackRate = 1;
            if (this.timeSetLock + (this.options.timeSetLockTime || 1000) < performance.now()) {
                this.el.currentTime = this.timeMediaShouldBe;
                this.timeSetLock = performance.now();
            }
        }
        else {
            // adjust playbackSpeed
            const timeInWhichToPlay = this.options.attackRate || 500;
            const timeToPlay = timeInWhichToPlay + -delta;
            const speed = timeToPlay / timeInWhichToPlay;
            this.cachedSpeed = speed;
            this.el.playbackRate = speed;
        }
    }
}
