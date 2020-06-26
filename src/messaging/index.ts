import container from 'inversify.config';
import MemoryManager, * as MemoryManagerMeta from 'service/memory/MemoryManager';

export namespace Messaging {
    export interface MessageReceiver {
        receiveMessage(sender: string, tick: number, payload: object): boolean;
    }

    export interface MessageSender {
        sendMessage(receiver: string, expire: number, payload: object): number
    };

    export interface MessageSenderReceiver extends MessageSender, MessageReceiver { };

    export function sendMessage(sender: string, receiver: string, expire: number, payload: object): number {
        const memoryManager: MemoryManager =
            container.get<MemoryManager>(MemoryManagerMeta.TYPE);
        const AB: number = 1 - (Game.time & 1);

        if (memoryManager.getMemory().debug) {
            console.log(`Sending message on to ${receiver} on channel ${AB}`);
        }

        if (!memoryManager.getMemory().messages[AB]) {
            memoryManager.getMemory().messages[AB] = [];
        }

        return memoryManager.getMemory().messages[AB].push(
            new Message(
                sender,
                receiver,
                Game.time + expire,
                Game.time,
                payload));
    }

    export function receiveMessage(sender: string, tick: number, payload: object): boolean {
        const memoryManager: MemoryManager =
            container.get<MemoryManager>(MemoryManagerMeta.TYPE);
        const AB: number = Game.time & 1;

        if (memoryManager.getMemory().debug) {
            console.log(`Receiving message ${JSON.stringify(payload)} on channel ${AB}`);
        }

        return true;
    }

    export class Message {
        private _sender: string;
        private _receiver: string;
        private _expire: number;
        private _tick: number;
        private _payload: object;


        constructor(sender: string, receiver: string, expire: number, tick: number, payload: object) {
            this._sender = sender;
            this._receiver = receiver;
            this._expire = expire;
            this._tick = tick;
            this._payload = payload;
        }

        public get sender(): string {
            return this._sender;
        }

        public get receiver(): string {
            return this._receiver;
        }

        public get expire(): number {
            return this._expire;
        }

        public get tick(): number {
            return this._tick;
        }

        public get payload(): object {
            return this._payload;
        }
    }

}
