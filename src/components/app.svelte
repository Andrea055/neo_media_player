<App { ...f7params }>

  <!-- Left panel with cover effect-->
  <Panel left cover dark>
    <View>
      <Page>
        <Navbar title="Left Panel"/>
        <Block>Left panel content goes here</Block>
      </Page>
    </View>
  </Panel>


  <!-- Right panel with reveal effect-->
  <Panel right reveal dark>
    <View>
      <Page>
        <Navbar title="Right Panel"/>
        <Block>Right panel content goes here</Block>
      </Page>
    </View>
  </Panel>


  <!-- Views/Tabs container -->
  <Views tabs class="safe-areas">
    <!-- Tabbar for switching views-tabs -->
    <Toolbar tabbar icons bottom>
      <Link tabLink="#view-home" tabLinkActive iconIos="f7:tv" iconMd="material:tv" text="IPTV" />
      <Link tabLink="#view-media-player" iconIos="f7:film" iconMd="f7:film" text="Media player" />
      <!-- <Link tabLink="#view-settings" iconIos="f7:gear" iconMd="material:settings" text="Settings" /> -->
    </Toolbar>

    <!-- Your main view/tab, should have "view-main" class. It also has "tabActive" prop -->
    <View id="view-home" main tab tabActive url="/" />

    <!-- Catalog View -->
    <View id="view-media-player" name="Media Player" tab url="/media_player/" />

    <!-- Settings View -->
    <View id="view-settings" name="settings" tab url="/settings/" />

  </Views>
</App>
<script>
  import { onMount } from 'svelte';
  import { getDevice }  from 'framework7/lite-bundle';
  import {
    f7,
    f7ready,
    App,
    Panel,
    Views,
    View,
    Page,
    Navbar,
    Toolbar,
    Link,
    Block,
  } from 'framework7-svelte';

  import capacitorApp from '../js/capacitor-app';
  import routes from '../js/routes';

  const device = getDevice();
  // Framework7 Parameters
  let f7params = {
    name: 'Neo IPTV player', // App name
    theme: 'auto', // Automatic theme detection
    colors: {
      primary: '#b800ff',
    },
    darkMode: true,
    // App routes
    routes: routes,

    // Register service worker (only on production build)
    serviceWorker: process.env.NODE_ENV ==='production' ? {
      path: (import.meta.env.BASE_URL).concat('/service-worker.js'),
    } : {},
    // Input settings
    input: {
      scrollIntoViewOnFocus: device.capacitor,
      scrollIntoViewCentered: device.capacitor,
    },
    // Capacitor Statusbar settings
    statusbar: {
      iosOverlaysWebView: true,
      androidOverlaysWebView: false,
    },
  };

  onMount(() => {
    f7ready(() => {

      // Init capacitor APIs (see capacitor-app.js)
      if (f7.device.capacitor) {
        capacitorApp.init(f7);
      }
      // Call F7 APIs here
    });
  })
</script>