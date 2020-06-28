import NumberPair from "model/NumberPair";
import Matrix from "collection/Matrix";
import Rect from "model/Rect";

export default class RoomVisualUtils {
    public static drawPoint(pos: NumberPair): void {
        return RoomVisualUtils.drawPointInRoom(new RoomVisual, pos);
    }

    public static drawPointInRoom(
        roomVisual: RoomVisual,
        pos: NumberPair
    ): void {
        roomVisual.circle(pos.x, pos.y, { fill: "white", radius: 0.5 });
    }

    public static drawRect(rect: Rect): void {
        RoomVisualUtils.drawRectInRoom(new RoomVisual(), rect);
    }

    public static drawRectInRoom(roomVisual: RoomVisual, rect: Rect): void {
        roomVisual.rect(rect.x - 0.5, rect.y - 0.5, rect.w, rect.h, {
            stroke: "red",
            opacity: 0.1,
        });
    }

    public static drawMatrix(pos: NumberPair, matrix: Matrix<number>): void {
        return RoomVisualUtils.drawMatrixInRoom(new RoomVisual(), pos, matrix);
    }

    public static drawMatrixInRoom(
        roomVisual: RoomVisual,
        pos: NumberPair,
        matrix: Matrix<number>
    ): void {
        roomVisual.rect(
            pos.x - 0.5,
            pos.y - 0.5,
            matrix.size(),
            matrix.size(),
            { fill: "green" }
        );
    }

    public static drawPath(path: PathStep[], color: string): void {
        return RoomVisualUtils.drawPathInRoom(new RoomVisual(), path, color);
    }

    public static drawPathInRoom(
        roomVisual: RoomVisual,
        path: PathStep[],
        color: string
    ): void {
        for (let i: number = 1; i < path.length; i++) {
            roomVisual.line(path[i - 1].x, path[i - 1].y, path[i].x, path[i].y, {
                color,
                lineStyle: 'dashed',
            });
        }
    }
}
