<script lang="ts">
    import { Navbar, Page, f7 } from "framework7-svelte";
    import { channel } from "../js/store";
    import { onMount } from "svelte";
    import mpegts from "mpegts.js";
    import hls from "hls.js";

    let player: mpegts.Player;
    let hls_player: hls; 
    onMount(async () => {
        // Web
        const videoElement = document.getElementById("player") as HTMLMediaElement;
        player = mpegts.createPlayer({
            type: "mse", // could also be mpegts, m2ts, flv
            isLive: true,
            url: $channel.url.toString(),
            // cors: false
        });
        player.attachMediaElement(videoElement);
        player.load();
        player.play();
        player.on("error", () => {  // If we got an error try to reproduce stream with hls instead of mpeg2-ts, useful in m3u8 stream
            player.destroy();
            if (hls.isSupported()) {
                console.log("HLS supported");
                hls_player = new hls();

                // MEDIA_ATTACHED event is fired by hls_player object once MediaSource is ready
                hls_player.on(hls.Events.MEDIA_ATTACHED, function () {
                    console.log("video and hls.js are now bound together !");
                });

                hls_player.on(
                    hls.Events.MANIFEST_PARSED,
                    function (event, data) {
                        console.log(
                            "manifest loaded, found " +
                                data.levels.length +
                                " quality level"
                        );
                    }
                );
                hls_player.on(hls.Events.ERROR, (event, data) => {
                    f7.dialog.alert("Impossible to reproduce the stream.");  // We tried all the possible methods to reproduce the stream so notify user that we can't stream that
                });

                hls_player.loadSource($channel.url.toString());
                // bind them together
                hls_player.attachMedia(videoElement);
                videoElement.play();
            }
        });
        // } catch {
        // console.log("CATCH");

        // }
    });

    function kill_video() {
        // Destroy video stream on page close
        if(hls_player != null) {
            hls_player.destroy();
            return; // Don't try to kill mpegts.js stream since it's not open(we are using HLS.js)
        }
        try {
            player.destroy();
        } catch (error) {
            // Sometimes destroy not work
            console.error(error);
            player.pause();
        }
    }
</script>

<Page name="Player">
    <Navbar title="Player" backLink="Back" on:clickBack={kill_video} />

    <div class="container">
        <video
            preload="none"
            id="player"
            controls
            crossorigin=true
            playsinline
            poster="/loader.png"
        >
            <track kind="captions" />
        </video>
    </div>
</Page>

<style>
    video {
        width: 100%;
        height: auto;
    }
</style>
