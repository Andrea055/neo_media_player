<script lang="ts">
    export let f7router;
    import {
        Navbar,
        Page,
        List,
        ListItem,
        theme,
        f7,
        NavLeft,
        Link,
        NavRight,
        Icon,
    } from "framework7-svelte";
    import { groups, channels } from "../js/store";
    import { onMount } from "svelte";

    let vlInstance, component;
    let items = $groups;
    let page_title = "Groups";

    onMount(() => {
        vlInstance = component.virtualListInstance();
    });

    let vlData = {
        items: [],
    };

    function searchAll(query, items) {
        console.log("Searching...");
        const found = [];
        for (let i = 0; i < items.length; i += 1) {
            if (
                items[i].name.toLowerCase().indexOf(query.toLowerCase()) >= 0 ||
                query.trim() === ""
            )
                found.push(i);
        }
        console.log(found);
        return found; // return array with mathced indexes
    }

    function renderExternal(virtualList, virtualListData) {
        vlData = virtualListData;
    }

    function filter_list(group_name) {
        page_title = group_name;
        items = $channels.filter((a) => {
            return a.group.title == group_name;
        });
        vlInstance.items = items;
        vlInstance.update();
    }

    function go_back() {
        if (items == $groups) {
            console.log("ROUTER");
            f7router.back(); // If in groups view go to home
        } else {
            console.log("OKE");
            items = $groups; // If in channels filter go to groups view
            vlInstance.items = items;
            vlInstance.update();
        }
        page_title = "Groups";
    }
</script>

<Page name="Groups">
    <Navbar title={page_title}>
        <div
            slot="left"
            style="margin-left: 1em; margin-right: 1em;"
            on:click={go_back}
            on:keydown={() => {}}
            role="button"
            tabindex="0"
        >
            <Icon f7="arrow_left" />
        </div>
    </Navbar>
    <List strong outlineIos insetMd dividersIos class="searchbar-not-found">
        <ListItem title="Nothing found" />
    </List>
    <List
        bind:this={component}
        class="searchbar-found"
        strong
        outlineIos
        insetMd
        dividersIos
        ul={false}
        medialList
        virtualList
        virtualListParams={{
            items,
            searchAll,
            renderExternal,
            height: theme.ios ? 63 : theme.md ? 73 : 77,
        }}
    >
        <ul>
            {#each vlData.items as item, index (index)}
                <ListItem
                    mediaItem
                    link="#"
                    title={item.name}
                    subtitle={item.group.title}
                    style={`top: ${vlData.topPosition}px`}
                    virtualListIndex={items.indexOf(item)}
                    on:click={() => {
                        filter_list(item.name);
                    }}
                >
                    <img
                        alt="logo"
                        slot="media"
                        src={item.tvg.logo}
                        width="64"
                    />
                </ListItem>
            {/each}
        </ul>
    </List>
</Page>
