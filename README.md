# 🌪️ Zephyr Events

Ultra-fast ES2023 event emitter with **905B** bundle size and race-condition safety.

[![npm version](https://img.shields.io/npm/v/zephyr-events.svg)](https://www.npmjs.com/package/zephyr-events)
[![Bundle Size](https://img.shields.io/badge/size-905B-brightgreen.svg)](https://bundlephobia.com/package/zephyr-events)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

---

## ⚡ Key Features

- **🔥 Ultra Fast**: 33M+ operations/second with native Set/Map optimizations
- **🪶 Tiny Bundle**: Only 905B minified, 0 dependencies  
- **🛡️ Race-Condition Safe**: Immutable snapshots prevent handler modification issues
- **🎯 ES2023 Native**: Optional chaining, nullish coalescing, spread operators
- **📦 Tree Shakeable**: ES modules with proper exports
- **🔧 TypeScript**: Full type safety with generics and strict types

---

## 📥 Installation

```bash
npm install zephyr-events
```

---

## 🚀 Quick Start

```typescript
import zephyrEvents from 'zephyr-events';

// Create typed emitter
type Events = {
  user: { id: number; name: string }
  error: Error
}

const emitter = zephyrEvents<Events>();

// Subscribe with auto-cleanup
const unsubscribe = emitter.on('user', (user) => {
  console.log(`User: ${user.name}`);
});

// Emit events
emitter.emit('user', { id: 1, name: 'Alice' });

// Cleanup
unsubscribe();
```

---

## 🎨 API Reference

### `zephyrEvents<Events>()`

Create a new event emitter instance.

```typescript
const emitter = zephyrEvents<{
  message: string
  data: { value: number }
}>();
```

### `emitter.on(type, handler)`

Register event handler. Returns unsubscribe function.

```typescript
const unsub = emitter.on('message', (msg) => {
  console.log(msg);
});

// Wildcard listener
emitter.on('*', (type, event) => {
  console.log(`Event ${type}:`, event);
});
```

### `emitter.off(type, handler?)`

Remove event handler(s).

```typescript
// Remove specific handler
emitter.off('message', handler);

// Remove all handlers for type
emitter.off('message');
```

### `emitter.emit(type, event)`

Emit event to all registered handlers.

```typescript
emitter.emit('message', 'Hello World!');
emitter.emit('data', { value: 42 });
```

---

## 🏗️ Technical Details

### Architecture

Zephyr Events uses a **dual-storage architecture** for maximum performance:

- **Set**: O(1) add/remove operations
- **Array snapshots**: Fast iteration with race-condition safety
- **ES2023 optimizations**: Native optional chaining and nullish coalescing

### Race-Condition Safety

Handlers are executed from immutable snapshots:

```typescript
emitter.on('test', function selfRemover() {
  emitter.off('test', selfRemover); // Safe during emit
});
```

### ES2023 Features

- **Nullish coalescing**: `all ??= new Map()`
- **Optional chaining**: `handlers?.size`
- **Spread operators**: `[...handlers]` for fast snapshots

### Bundle Formats

- **ESM**: `dist/zephyr-events.mjs` (905B)
- **CommonJS**: `dist/zephyr-events.js` (977B) 
- **UMD**: `dist/zephyr-events.umd.js` (1.3KB)

---

## 🆚 Comparison

| Feature | Zephyr Events | mitt* | eventemitter3 |
|---------|---------------|------|---------------|
| Bundle Size | 905B | 200B | 7KB |
| TypeScript | ✅ Native | ✅ | ✅ |
| Race-Safe | ✅ | ❌ | ❌ |
| ES2023 | ✅ | ❌ | ❌ |
| Performance | 33M ops/s | 15M ops/s | 10M ops/s |

*\*Based on original mitt package by Jason Miller*

---

## 🚀 Performance Benchmarks

Comprehensive performance benchmarks on **Apple Silicon M-series (ARM64)** with **Node.js v23.10.0**:

### Core Operations Performance

| Operation | Ops/Second | Description |
|-----------|------------|-------------|
| **Emitter Creation** | **10.54M** | Creating new emitter instances |
| **Single Handler Emit** | **33.69M** | Emitting to one event handler |
| **Wildcard Emit** | **26.12M** | Emitting to wildcard listeners |
| **10 Handlers Emit** | **9.32M** | Emitting to 10 concurrent handlers |
| **100 Handlers Emit** | **1.57M** | Emitting to 100 concurrent handlers |
| **Mixed Operations** | **7.17M** | Realistic usage: on/emit/off cycle |

### Management Operations Performance

| Operation | Ops/Second | Description |
|-----------|------------|-------------|
| **Off Method** | **194.17M** | Removing specific handler with `.off()` |
| **Unsubscribe** | **143.54M** | Removing handler with returned function |
| **Event Subscription** | **9.19K** | Adding new event handlers with `.on()` |
| **Memory Stress** | **130** | Complex multi-event scenario |

### Key Performance Insights

- **🔥 Ultra-fast emission**: Up to **33.69M operations/second** for single handlers
- **⚡ Instant cleanup**: Handler removal at **194.17M operations/second**  
- **📈 Scales efficiently**: Maintains high performance with multiple handlers
- **🛡️ Race-condition safe**: Minimal overhead for safety guarantees
- **🎯 Real-world optimized**: **7.17M ops/sec** for typical usage patterns

### Architecture Benefits

- **Dual Storage**: Set for O(1) add/remove + Array snapshots for fast iteration
- **ES2023 Native**: Optional chaining (`?.`) and nullish coalescing (`??`) optimizations
- **Memory Efficient**: Stable performance under stress conditions
- **Zero Dependencies**: Pure JavaScript with no external overhead

---

## 🙏 Acknowledgments

**Zephyr Events** is a heavy modernization and performance upgrade of the original [mitt](https://github.com/developit/mitt) package by [Jason Miller](https://github.com/developit). Thanks for the foundational work!

---

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md).

## 📄 License

MIT © [ebogdum](https://github.com/ebogdum)

Original mitt: MIT © [Jason Miller](https://github.com/developit)