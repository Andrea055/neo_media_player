<script lang="ts">
    import {
        Icon,
        Link,
        NavRight,
        Navbar,
        Page,
        Block,
        Button,
        f7,
    } from "framework7-svelte";
    import { get_media_in_store, save_media_to_store } from "../js/media_store";
    import { CapacitorVideoPlayer } from "capacitor-video-player";

    let file_picker;

    function add_online_media() {
        f7.dialog.prompt("URL", "Add online media", async (value) => {
            save_media_to_store({
                name: value.split('/').pop(),
                url: value,    // Approximately we can get the filename if it's the last part of the URL
            });
            CapacitorVideoPlayer.initPlayer({
                mode: "fullscreen",
                url: value,
                playerId: "fullscreen",
                componentTag: "div",
            });
        });
    }

    function add_local_media() {
        file_picker.click();
    }

    async function handle_file_select(e) {
        const media: File = e.target.files[0];
        const videoURL = URL.createObjectURL(media); // Create URL from local file
        CapacitorVideoPlayer.initPlayer({
            mode: "fullscreen",
            url: videoURL,
            playerId: "fullscreen",
            componentTag: "div",
        });
    }

    function add_new_media() {
        f7.dialog
            .create({
                title: "Play new media",
                buttons: [
                    {
                        text: "Add local media",
                        onClick: add_local_media,
                    },
                    {
                        text: "Add online media",
                        onClick: add_online_media,
                    },
                ],
                verticalButtons: true,
            })
            .open();
    }
</script>

<Page name="Media player">
    <Navbar title="Media Player">
        <NavRight
            ><Link href="/media_history/">
                <Icon f7="timer" />
            </Link></NavRight
        >
    </Navbar>

    <input
        type="file"
        hidden
        on:change={handle_file_select}
        bind:this={file_picker}
        accept="video/mp4,video/x-m4v,video/*"
    />
    <Block>
        <Button fill on:click={add_new_media}>Play a new video</Button>
    </Block>

    <div id="fullscreen" />
</Page>
