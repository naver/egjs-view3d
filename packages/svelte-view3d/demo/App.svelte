<script lang="ts">
  import { Router, Link, Route } from "svelte-routing";
  import Basic from "./components/Basic.svelte";
  import Event from "./components/Event.svelte";
  import Method from "./components/Method.svelte";
  import Annotation from "./components/Annotation.svelte";
  import PluginDemo from "./components/Plugin.svelte";
  import PropChange from "./components/PropChange.svelte";
  import "@egjs/view3d/css/view3d-bundle.min.css";

  export let url = "";
</script>

<Router url="{url}">
  <nav class="header is-size-4">
    <Link to="/basic">Basic</Link>
    <Link to="/event">Event</Link>
    <Link to="/method">Method</Link>
    <Link to="/annotation">Annotation</Link>
    <Link to="/plugin">Plugin</Link>
    <Link to="/prop">PropChange</Link>
  </nav>
  <div>
    <Route path="basic" component={Basic} />
    <Route path="event" component={Event} />
    <Route path="method" component={Method} />
    <Route path="annotation" component={Annotation} />
    <Route path="plugin" component={PluginDemo} />
    <Route path="prop" component={PropChange} />
    <Route path="/"></Route>
  </div>
</Router>
