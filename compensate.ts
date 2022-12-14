// all times in ms
class Compensator extends EventTarget {
    constructor(readonly el: HTMLMediaElement, public options: {
        /**
         * @summary time in ms, a delay is idealy compensated
         * @default 500
         * @unit milliseconds
         * @description value used to compute playbackSpeed
        */
        attackRate?: number,
        /**
         * @summary maximum delay in ms, which is compensated by adjusting playback speed 
         * @default 1000
         * @unit milliseconds
         */
        methodThreshold?: number,
        /**
         * @summary time is ms, defining the interval of calling `.sync()`
         * @default 30
         * @unit milliseconds
         */
        syncInterval?: number,
        /**
         * @summary mimumum time in ms between two sets of currentTime
         * @default 1000
         * @unit millisconds
         */
        timeSetLockTime?: number,
        /**
         * @summary if true, playback will start again from the beginning, when the end is reached
         * @default false
         * @unit bool
         */
        loop?: boolean;
    }) {
        super();
        setInterval(this.sync.bind(this), options.syncInterval || 30);
        el.addEventListener("ended", () => {
            if (options.loop) {
                this.startFromTheBeginning();
                this.dispatchEvent(new Event("loopback"));
            } else {
                this.time = 0;
                el.currentTime = 0;
                this.pause();
            }
        })
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
        if (this.playState == "pause") return;
        this.el.pause();
        this.playBaseTime = this.timeMediaShouldBe;
        this.playStartRealTime = NaN;
        this.playState = "pause";
        this.sync();
    }
    play() {
        if (this.playState == "play") return;
        this.el.play();
        this.playBaseTime;
        this.playStartRealTime = performance.now();
        this.playState = "play";
        this.sync();
    }
    set time(time: number) {
        this.playBaseTime = time;
        this.playStartRealTime = performance.now();
        this.sync();
    }
    get time() {
        return this.timeMediaShouldBe;
    }
    protected playState: "play" | "pause" = "pause";
    protected playStartRealTime = NaN;
    protected playBaseTime = 0;
    cachedTimeShouldBe = NaN; // @debugger

    get timeMediaShouldBe() {
        if (this.playState == "play") {
            return this.playBaseTime + (performance.now() - this.playStartRealTime);
        } else {
            return this.playBaseTime;
        }
    }
    cachedDelta = NaN; // @debugger
    cachedSpeed = NaN; // @debugger
    protected timeSetLock = -Infinity;
    protected sync() {
        this.cachedTimeShouldBe = this.timeMediaShouldBe;
        /** \+ = player ahead, - = player behind*/
        let delta = this.el.currentTime * 1000 - this.timeMediaShouldBe;
        let absDelta = Math.abs(delta);
        this.cachedDelta = delta;
        if (absDelta > (this.options.methodThreshold || 1000)) {
            // set currentTime
            this.el.playbackRate = 1;
            if (this.timeSetLock + (this.options.timeSetLockTime || 1000) < performance.now()) {
                this.el.currentTime = this.timeMediaShouldBe / 1000;
                this.timeSetLock = performance.now();
            }
        } else {
            // adjust playbackSpeed
            const timeInWhichToPlay = this.options.attackRate || 500;
            const timeToPlay = timeInWhichToPlay + -delta;
            const speed = timeToPlay / timeInWhichToPlay;
            this.cachedSpeed = speed;
            this.el.playbackRate = speed;
        }
    }
}
