import { service } from "inversify.config";
import Timing from "model/Timing";

export const TYPE_TICK_CALCULATOR: symbol = Symbol('TickCalculator');

export interface TickCalculator {
    getInitialTiming(sampleRate: number): Timing;
    calculate(sampleRate: number, timing: Timing): Timing;
}

@service<TickCalculator>(TYPE_TICK_CALCULATOR)
export class _TickCalculator implements TickCalculator {
    public getInitialTiming(sampleRate: number): Timing {
        const lastTickMs: number = Math.floor(sampleRate + (sampleRate / 10));
        return new Timing(Date.now() - lastTickMs, lastTickMs / 1000, 0, 0);
    }

    public calculate(sampleRate: number, timing: Timing): Timing {
        const millis: number = Date.now();

        let { lastTickMs, lastTick, tickCounter, tickTimeTotal } = timing;

        tickTimeTotal += millis - lastTickMs;
        if (tickCounter >= (sampleRate - 1)) {

            tickCounter++;
            lastTick = (tickTimeTotal / tickCounter) / 1000;
            tickTimeTotal = millis - lastTickMs;
            tickCounter = 1;
            lastTickMs = millis;

            return new Timing(
                millis, (tickTimeTotal / tickCounter) / 1000,
                1, millis - lastTickMs);
        }
        else {
            return new Timing(
                millis, lastTick,
                tickCounter++, tickTimeTotal + (millis - lastTickMs));
        }
    }

}
