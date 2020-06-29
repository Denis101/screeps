import container from 'inversify.config';
import { GameManager, GameManagerImpl } from 'service/GameManager';
import { MemoryManager, MemoryManagerImpl } from 'service/MemoryManager';

export namespace Messaging {
    export interface MessageReceiver {
        receiveMessage(sender: string, tick: number, payload: object): boolean;
    }

    export interface MessageSender {
        sendMessage(receiver: string, expire: number, payload: object): number
    };

    export interface MessageSenderReceiver extends MessageSender, MessageReceiver { };

    export function sendMessage(sender: string, receiver: string, expire: number, payload: object): number {
        const gameManager: GameManager =
            container.get<GameManager>(GameManagerImpl.TYPE);
        const memoryManager: MemoryManager =
            container.get<MemoryManager>(MemoryManagerImpl.TYPE);
        const AB: number = 1 - (gameManager.getTime() & 1);

        if (memoryManager.isDebug()) {
            console.log(`Sending message on to ${receiver} on channel ${AB}`);
        }

        if (!memoryManager.getMessageChannel(AB)) {
            memoryManager.setMessageChannel(AB, []);
        }

        return memoryManager.getMessageChannel(AB).push(
            new Message(
                sender,
                receiver,
                gameManager.getTime() + expire,
                gameManager.getTime(),
                payload));
    }

    export function receiveMessage(sender: string, tick: number, payload: object): boolean {
        const gameManager: GameManager =
            container.get<GameManager>(GameManagerImpl.TYPE);
        const memoryManager: MemoryManager =
            container.get<MemoryManager>(MemoryManagerImpl.TYPE);
        const AB: number = gameManager.getTime() & 1;

        if (memoryManager.isDebug()) {
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
