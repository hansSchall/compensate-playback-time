let c: Compensator;
let v: HTMLVideoElement | undefined;
async function main() {
    v = document.getElementById("video") as HTMLVideoElement | undefined;
    if (!v) {
        debugger;
        return;
    }
    c = new Compensator(v, {
        loop: true,
    })
    c.addEventListener("loopback", () => {
        console.log("loopback");
    })
    const timeEl = document.getElementById("currentTime");
    if (!timeEl) {
        debugger;
        return;
    };
    setInterval(() => {
        timeEl.innerText = `t.virtual=${c.timeMediaShouldBe}
        Δt=${c.cachedDelta}
        v.pb=${c.cachedSpeed}`;
    }, 100)
    // debugger;
}
window.addEventListener("load", main);