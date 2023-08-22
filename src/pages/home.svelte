<script lang="ts">
  export let f7router;

  import {
    Page,
    Navbar,
    NavRight,
    Block,
    List,
    ListItem,
    Icon,
    Searchbar,
    Subnavbar,
    f7,
    theme,
    ListInput,
    Link,
    Button,
    Popover,
  } from "framework7-svelte";
  import {
    add_list_to_store,
    get_lists_from_store,
    remove_list_from_store,
  } from "../js/list_store";
  import parser from "iptv-playlist-parser";
  import { onMount } from "svelte";
  import type { Channel } from "../types/channel";
  import { channel, groups, channels } from "../js/store";
  import { Picker } from "framework7/types";

  let root = null;
  let current_list;
  let vlInstance, component;
  let list_picker: Picker.Picker;

  function create_list_picker() {
    const lists = get_lists_from_store();
    const lists_name = lists.map((list) => list.name); // Get only the name of list
    list_picker = f7.picker.create({
      inputEl: "#list_picker",
      cols: [
        {
          textAlign: "center",
          values: lists_name,
        },
      ],
      on: {
        init(picker) {
          if (lists_name.length > 0) {
            current_list = lists_name[0];
            picker.setValue([current_list]); // Set first list in store as default
          }
        },
        change(value) {
          let new_list = lists.filter(
            (list) => list.name == value.getValue()
          )[0];

          if (current_list != new_list) {
            // Avoid reinitialization of first list
            change_list(new_list);
          }
        },
      },
    });
  }

  function update_picker() {
    // Dirty hack to update picker values
    list_picker.setValue([""]);
    list_picker.destroy();
    create_list_picker();
  }

  onMount(() => {
    let root_app_listener = setTimeout(() => {
      if (f7.el != null) {
        root = f7.el;
        create_list_picker();
        console.debug("Application initialized");
        clearTimeout(root_app_listener);
      }
    }, 500);
  });

  let list_saved = get_lists_from_store();

  let vlData = {
    items: [],
  };
  function add_new_list() {
    f7.dialog.prompt("Enter the list url:", "Add new list", (url) => {
      f7.dialog.prompt(
        "Enter the name of the list:",
        "Add new list",
        (name) => {
          add_list_to_store({
            url: new URL(url),
            name: name,
          });
          list_saved = get_lists_from_store();
          update_picker();
        }
      );
    });
  }

  function filter_group(current_list: parser.PlaylistItem[]) {
    return current_list
      .map((channel_in_list) => {
        return {
          name: channel_in_list.group.title,
          group: {
            title: "",
          },
          tvg: {
            // We can use the logo in channel since in a set only the first channel will remain and the others deleted.
            // The first channel should be the category channel, others are real channels
            logo: channel_in_list.tvg.logo,
          },
        };
      })
      .filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.name === value.name)
      );
  }

  async function parse_list(list: import("../types/list").List) {
    if(list == null) return [];  // When we delete all the lists parse_list will called with a null list so return an empty array
    console.debug("Parsing list...");
    if ($channels.length > 0 && current_list == list) {
      // Check if we changed the list between current_list and cached one
      console.debug("Using cache for channels");
      // If we have saved channels use the cached list, this is used between this page and group
      return $channels;
    }
    try {
      f7.dialog.preloader("Downloading the list...");
        let m3u = await (await fetch("https://corsproxy.io/?" + list.url)).text();  // Use corsproxy to avoid CORS issues
      const result = parser.parse(m3u);
      $groups = filter_group(result.items); // Save the groups for groups page
      $channels = result.items; // Save the channels for groups page and go back to this page without download again whole list
      f7.dialog.close();
      return result.items;
    } catch (error) {
      // Download something can fail, so notify at user
      f7.dialog.close(); // Close previous dialog
      f7.dialog.alert("Error during download of list");
      console.error(error);
      return [];
    }
  }

  function searchAll(query, items) {
    console.debug("Searching...");
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

  function play_channel(new_channel: Channel) {
    $channel = new_channel;
    f7router.navigate("/player");
  }

  function delete_list() {
    console.debug("Deleting list...");
    remove_list_from_store(current_list);
    $channels = [];
    $groups = [];
    if (vlInstance == null && component != null)
      vlInstance = component.virtualListInstance();
    vlInstance.items = [];
    vlInstance.update();
    update_picker();
  }

  async function change_list(new_list) {
    if (vlInstance == null && component != null)
      vlInstance = component.virtualListInstance();
    try {
      if (current_list != null) {
        vlInstance.items = await parse_list(new_list);
        vlInstance.update();
        current_list = new_list;
      }
    } catch (error) {
      console.warn("ERROR DURING CHANGED LIST");
    }
  }
</script>

<Page name="home">
  <!-- Top Navbar -->
  <Navbar title="Neo Media player">
    <NavRight>
      <!-- <Button fill popoverOpen=".popover-menu">Open popover on me</Button> -->
      <Link popoverOpen=".popover-menu">
        <Icon f7="ellipsis_vertical" />
      </Link>
      <!-- <div
        role="button"
        aria-pressed="false"
        tabindex="0"
        on:click={add_new_list}
        on:keydown={() => {}}
      >
        <Icon f7="plus" />
      </div>
      <br />
      <Link href="/groups">
        <Icon f7="line_horizontal_3" />
      </Link>
      <div
        role="button"
        aria-pressed="false"
        tabindex="0"
        on:click={delete_list}
        on:keydown={() => {}}
      >
        <Icon f7="trash" />
      </div> -->
    </NavRight>
    <!-- <Subnavbar inner>
      <Searchbar
        searchContainer=".virtual-list"
        searchItem="li"
        searchIn=".item-title"
      />
    </Subnavbar> -->
  </Navbar>

  <Popover class="popover-menu">
    <List>
      <ListItem link="/groups/" popoverClose title="Groups" />
      <ListItem link="#" popoverClose title="Add new list" on:click={add_new_list}/>
      <ListItem link="#" popoverClose title="Delete current list" on:click={delete_list}/>
    </List>
  </Popover>
  <List strongIos outlineIos>
    <ListInput
      id="list_picker"
      type="text"
      placeholder="Current list"
      readonly
      inputId="list_picker"
    />
  </List>

  {#if list_saved.length == 0}
    <div
      class="display-flex justify-content-center flex-direction-column align-items-center"
    >
      <Block>
        <p>No list saved. Please add a new one.</p>
        <div
          class="text-align-center"
          role="button"
          aria-pressed="false"
          tabindex="0"
          on:click={add_new_list}
          on:keypress={() => {}}
        >
          <Icon f7="plus" />
        </div>
      </Block>
    </div>
  {:else if root != null}
    <List strong outlineIos insetMd dividersIos class="searchbar-not-found">
      <ListItem title="Nothing found" />
    </List>
    {#await parse_list(list_saved[0]) then items}
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
                play_channel({
                  name: item.name,
                  url: item.url,
                });
              }}
            >
              <!-- This fragment is necessary to use the if block with slot -->
              <svelte:fragment slot="media">
                {#if item.tvg.logo != ""}
                  <img alt="logo" src={item.tvg.logo} width="64" />
                {/if}
              </svelte:fragment>
            </ListItem>
          {/each}
        </ul>
      </List>
    {/await}
  {/if}
</Page>
