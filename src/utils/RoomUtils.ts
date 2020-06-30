import Matrix from "collection/Matrix";
import Rect from "model/Rect";
import SourceMeta from "model/SourceMeta";
import ScreepsStructureMemory from "screeps/ScreepsStructureMemory";

export default class RoomUtils {
    public static getSourceMeta(room: Room): SourceMeta[] {
        return room.find(FIND_SOURCES).map(SourceMeta.fromSource);
    }

    public static walkableAtArea(room: Room, search: Rect): number {
        const area: Matrix<number> = RoomUtils.terrainAtArea(room, search);

        let count: number = 0;
        for (let y: number = 0; y < area.size(); y++) {
            for (let x: number = 0; x < area.size(); x++) {
                const value: number = area.get(y).get(x);
                count += value === TERRAIN_MASK_WALL
                    || value === TERRAIN_MASK_LAVA
                    ? 0 : 1;
            }
        }

        return count;
    }

    public static distancesToHostileStructures(room: Room, pos: RoomPosition): number[] {
        const result: number[] = [];
        const structs: AnyOwnedStructure[] = room.find(FIND_HOSTILE_STRUCTURES);

        for (let i: number = 0; i < structs.length; i++) {
            const path: PathStep[] = room.findPath(pos, structs[i].pos);
            result[i] = path.length;
        }

        return result;
    }

    public static terrainAtArea(room: Room, search: Rect): Matrix<number> {
        const area: LookAtResultMatrix<LOOK_TERRAIN> =
            room.lookForAtArea(LOOK_TERRAIN, search.top, search.left, search.bottom, search.right);

        const result: number[][] = [];
        for (const y of Object.keys(area)) {
            result[(y as any) - search.top] = [];
            const row: any = area[y as any];
            for (const x of Object.keys(row)) {
                const val: any = row[x as any][0];
                const terrain: number = (val as string) === "wall" ? 1 : 0;
                result[(y as any) - search.top][(x as any) - search.left] = terrain;
            }
        }

        return Matrix.fromArray(result);
    }

    public static structuresAtArea(room: Room, search: Rect): Structure[] {
        const area: LookForAtAreaResultArray<Structure<StructureConstant>, LOOK_STRUCTURES> =
            room.lookForAtArea(LOOK_STRUCTURES, search.top, search.left, search.bottom, search.right, true);
        const result: Structure[] = [];
        for (const v of area) {
            result.push(v.structure);
        }

        return result;
    }

    public static getStructureMemory(structures: Structure[]): ScreepsStructureMemory[] {
        return structures.map((s: Structure) => ({
            id: s.id,
            pos: s.pos,
            type: s.structureType,
        }));
    }
}
