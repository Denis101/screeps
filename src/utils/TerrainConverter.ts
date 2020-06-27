import Matrix from "collection/Matrix";

export default class TerrainConverter {
    private static readonly ROOM_SIZE: number = 50;

    public static toMatrix(raw: number[]): Matrix<number> | null {
        if (!raw || raw.length <= 0) {
            return null;
        }

        const result: number[][] = [];
        for (let y: number = 0; y < this.ROOM_SIZE; y++) {
            result[y] = [];
            for (let x: number = 0; x < this.ROOM_SIZE; x++) {
                const code: number = raw[y * this.ROOM_SIZE + x];
                const unbuildable: number = code & TERRAIN_MASK_WALL ||
                    code & TERRAIN_MASK_LAVA;
                result[y][x] = unbuildable;
            }
        }

        return Matrix.fromArray(result);
    }
}
