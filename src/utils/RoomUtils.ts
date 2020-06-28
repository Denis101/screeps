import Matrix from "collection/Matrix";
import Rect from "model/Rect";
import SourceMeta from "model/SourceMeta";

export default class RoomUtils {
    public static getSourceMeta(room: Room): SourceMeta[] {
        return room.find(FIND_SOURCES).map(SourceMeta.fromSource);
    }

    public static walkableAtArea(room: Room, search: Rect): number {
        let count: number = 0;

        let area: Matrix<number> = RoomUtils.terrainAtArea(room, search);
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
            result[<any>y - search.top] = [];
            const row = area[<any>y];
            for (const x of Object.keys(row)) {
                const val: any = row[<any>x][0];
                const terrain: number = (<string>val) === "wall" ? 1 : 0;
                result[<any>y - search.top][<any>x - search.left] = terrain;
            }
        }

        return Matrix.fromArray(result);
    }
}
