import Matrix from "collection/Matrix";
import Rect from "model/Rect";
import SourceMeta from "model/SourceMeta";

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
}
