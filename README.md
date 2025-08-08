# 🌪️ Zephyr Events

Ultra-fast ES2023 event emitter with **889B** bundle size and race-condition safety.

[![npm version](https://img.shields.io/npm/v/zephyr-events.svg)](https://www.npmjs.com/package/zephyr-events)
[![Bundle Size](https://img.shields.io/badge/size-889B-brightgreen.svg)](https://bundlephobia.com/package/zephyr-events)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

## 🙏 Acknowledgments

**Zephyr Events** is a **heavy modernization and performance upgrade** of the original [mitt](https://github.com/developit/mitt) package by [Jason Miller](https://github.com/developit). Thanks for the foundational work! 🎉

## ⚡ Features

- **🔥 Ultra Fast**: 20M+ operations/second with native Set/Map optimizations
- **🪶 Tiny Bundle**: Only 889B minified, 0 dependencies  
- **🛡️ Race-Condition Safe**: Immutable snapshots prevent handler modification issues
- **🎯 ES2023 Native**: Optional chaining, nullish coalescing, spread operators
- **📦 Tree Shakeable**: ES modules with proper exports
- **🔧 TypeScript**: Full type safety with generics and strict types

## 📥 Installation

```bash
npm install zephyr-events
```

## 🚀 Quick Start

```typescript
import mitt from 'zephyr-events';

// Create typed emitter
type Events = {
  user: { id: number; name: string }
  error: Error
}

const emitter = mitt<Events>();

// Subscribe with auto-cleanup
const unsubscribe = emitter.on('user', (user) => {
  console.log(`User: ${user.name}`);
});

// Emit events
emitter.emit('user', { id: 1, name: 'Alice' });

// Cleanup
unsubscribe();
```

## 🎨 API

### `mitt<Events>()`

Create a new event emitter instance.

```typescript
const emitter = mitt<{
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

## 🏗️ Architecture

Zephyr Events uses a **dual-storage architecture** for maximum performance:

- **Set**: O(1) add/remove operations
- **Array snapshots**: Fast iteration with race-condition safety
- **ES2023 optimizations**: Native optional chaining and nullish coalescing

## ⚡ Performance

```typescript
// Benchmark: 1M emits with 10 handlers
// Result: ~20M operations/second
```

## 🔒 Race-Condition Safety

Handlers are executed from immutable snapshots:

```typescript
emitter.on('test', function selfRemover() {
  emitter.off('test', selfRemover); // Safe during emit
});
```

## 🌟 ES2023 Features

- **Nullish coalescing**: `all ??= new Map()`
- **Optional chaining**: `handlers?.size`
- **Spread operators**: `[...handlers]` for fast snapshots

## 📦 Bundle Formats

- **ESM**: `dist/mitt.mjs` (889B)
- **CommonJS**: `dist/mitt.js` (961B) 
- **UMD**: `dist/mitt.umd.js` (1.2KB)

## 🆚 Comparison

| Feature | Zephyr Events | mitt* | eventemitter3 |
|---------|---------------|------|---------------|
| Bundle Size | 889B | 200B | 7KB |
| TypeScript | ✅ Native | ✅ | ✅ |
| Race-Safe | ✅ | ❌ | ❌ |
| ES2023 | ✅ | ❌ | ❌ |
| Performance | 20M ops/s | 15M ops/s | 10M ops/s |

*\*Original mitt package by Jason Miller*

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md).

## 📄 License

MIT © [ebogdum](https://github.com/ebogdum)

Original mitt: MIT © [Jason Miller](https://github.com/developit)

---

*Built with ❤️ and ES2023 • Inspired by mitt*