<script>
    import { Navbar, Page } from "framework7-svelte";
    // import { CapacitorVideoPlayer } from "capacitor-video-player";
    import { channel } from "../js/store";
    import { onMount } from "svelte";
    import mpegts from "mpegts.js";

    let player;
    onMount(async () => {
        // Web
        var videoElement = document.getElementById("player");
        player = mpegts.createPlayer({
            type: "mse", // could also be mpegts, m2ts, flv
            isLive: true,
            url: $channel.url,
            // cors: false
        });
        player.attachMediaElement(videoElement);
        player.load();
        player.play();
    });

    function kill_video() { // Destroy video stream on page close
        try {
            player.destroy();
        } catch (error) {   // Sometimes destroy not work
            console.error(error);
            player.pause();
        }
    }
</script>

<Page name="Player">
    <Navbar title="Player" backLink="Back" on:clickBack={kill_video}></Navbar>

    <div class="container">
        <video preload="none" id="player" controls crossorigin playsinline>
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
