export type EventType = string | symbol;

export type Handler<T = unknown> = (event: T) => void;
export type WildcardHandler<T = Record<string, unknown>> = (
	type: keyof T,
	event: T[keyof T]
) => void;

export type Unsubscribe = () => void;

export type EventHandlerList<T = unknown> = Array<Handler<T>>;
export type WildCardEventHandlerList<T = Record<string, unknown>> = Array<
	WildcardHandler<T>
>;

export type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<
	keyof Events | '*',
	EventHandlerList<Events[keyof Events]> | WildCardEventHandlerList<Events>
>;

export interface Emitter<Events extends Record<EventType, unknown>> {
	all: EventHandlerMap<Events>;

	on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): Unsubscribe;
	on(type: '*', handler: WildcardHandler<Events>): Unsubscribe;
	
	off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>): void;
	off(type: '*', handler: WildcardHandler<Events>): void;
	
	emit<Key extends keyof Events>(type: Key, event: Events[Key]): void;
	emit<Key extends keyof Events>(type: undefined extends Events[Key] ? Key : never): void;
}

export default function mitt<Events extends Record<EventType, unknown>>(
	all?: EventHandlerMap<Events>
): Emitter<Events> {
	type GenericEventHandler = Handler<Events[keyof Events]> | WildcardHandler<Events>;
	
	all ??= new Map();
	
	const handlerSets = new Map<keyof Events | '*', Set<GenericEventHandler>>();
	
	const getHandlerSet = (type: keyof Events | '*'): Set<GenericEventHandler> => {
		let handlers = handlerSets.get(type);
		if (!handlers) {
			handlers = new Set();
			handlerSets.set(type, handlers);
			all!.set(type, [] as any);
		}
		return handlers;
	};
	
	const syncMap = (type: keyof Events | '*'): void => {
		const handlers = handlerSets.get(type);
		if (handlers) {
			all!.set(type, [...handlers] as any);
		}
	};

	return {
		all,

		on<Key extends keyof Events>(type: Key, handler: GenericEventHandler): Unsubscribe {
			const handlers = getHandlerSet(type);
			
			handlers.add(handler);
			syncMap(type);
			
			return (): void => {
				handlers.delete(handler);
				syncMap(type);
			};
		},

		off<Key extends keyof Events>(type: Key, handler?: GenericEventHandler): void {
			const handlers = handlerSets.get(type);
			if (!handlers) return;
			
			handler ? handlers.delete(handler) : handlers.clear();
			syncMap(type);
		},

		emit<Key extends keyof Events>(type: Key, evt?: Events[Key]): void {
			const handlers = handlerSets.get(type);
			if (handlers?.size) {
				for (const handler of [...handlers] as Handler<Events[Key]>[]) {
					handler(evt!);
				}
			}
			
			const wildcards = handlerSets.get('*');
			if (wildcards?.size) {
				for (const handler of [...wildcards] as WildcardHandler<Events>[]) {
					handler(type, evt!);
				}
			}
		}
	};
}

