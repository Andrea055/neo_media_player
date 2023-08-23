<script>
    import { Navbar, Page, List, ListItem, NavRight, Link, Icon, SwipeoutActions, SwipeoutButton } from "framework7-svelte";
    import { cleanup_media_from_store, delete_media_from_store, get_media_in_store } from "../js/media_store";
    import { CapacitorVideoPlayer } from "capacitor-video-player";

    let history = get_media_in_store();

    function play_media(url) {
        CapacitorVideoPlayer.initPlayer({
            mode: "fullscreen",
            url: url,
            playerId: "fullscreen",
            componentTag: "div",
        });
    }
</script>

<Page name="media_history">
    <Navbar title="History" backLink="Back">
        <NavRight>
            <Link>
                <Icon f7="trash" on:click={cleanup_media_from_store}></Icon>
            </Link>
        </NavRight>
    </Navbar>

    <List strong insetMd outlineIos dividersIos>
        {#each history as media}
            <ListItem
                title={media.name}
                swipeout
                on:click={() => play_media(media.url)}
                onSwipeoutDeleted={() => delete_media_from_store(media)}
            >
            <SwipeoutActions right>
                <SwipeoutButton delete confirmText="Are you sure you want to delete this media from history?">
                  Delete
                </SwipeoutButton>
              </SwipeoutActions>
            </ListItem>
        {/each}
    </List>

    <div id="fullscreen" />
</Page>
