const convertTerrain = raw => {
    const result = [];
    for (let y = 0; y < 50; y++) {
        result[y] = [];
        for (let x = 0; x < 50; x++) {
            const code = raw[y * 50 + x];
            const unbuildable = code & TERRAIN_MASK_WALL ||
                code & TERRAIN_MASK_LAVA;
            result[y][x] = unbuildable ? 0 : 1;
        }
    }

    return result;
};

class Stack {
    constructor(...args) {
        this.store = [...args.reverse()];
    }

    peek() {
        return this.store[0];
    }

    push(value) {
        return this.store.unshift(value);
    }

    pop() {
        return this.store.shift();
    }

    contains(value) {
        for (let i = 0; i < this.store.length; i++) {
            if (this.store[i] === value) {
                return true;
            }
        }

        return false;
    }

    empty() {
        return this.store.length <= 0;
    }
};

class Cache {
    constructor(size, value) {
        this.store = [];
        for (let i = 0; i < size; i++) {
            this.store[i] = value;
        }
    }

    update(y, width, matrix) {
        for (let x = 0; x < width; x++) {
            if (matrix[y][x] != 0) {
                this.store[x]++;
            }
            else {
                this.store[x] = 0;
            }
        }
    }

    get(x) {
        return this.store[x];
    }
}

const findBiggestRect = (matrix, search) => {
    search = {
        x: 0,
        y: 0,
        w: matrix[0].length,
        h: matrix.length,
        ...(search || {}),
    };

    const stack = new Stack();
    const cache = new Cache(search.w, 0);

    let bestLowerLeft = [0, 0];
    let bestUpperRight = [-1, -1];

    let bestArea = 0;
    let bestPerimeter = 0;

    for (let y = search.y; y < search.h; y++) {
        let openWidth = 0;
        cache.update(y, search.w, matrix);

        for (let x = search.x; x < search.w; x++) {
            if (cache.get(x) > openWidth) {
                stack.push([x, openWidth]);
                openWidth = cache.get(x);
            }
            else if (cache.get(x) < openWidth) {
                let x0, w0, area, perimeter;

                do {
                    x0 = stack.peek()[0];
                    w0 = stack.peek()[1];
                    stack.pop();

                    area = openWidth * (x - x0);
                    perimeter = openWidth + (x - x0);

                    if (area > bestArea || (area == bestArea && perimeter < bestPerimeter)) {
                        bestArea = area;
                        bestPerimeter = perimeter;
                        bestLowerLeft = [x0, y];
                        bestUpperRight = [x - 1, y - openWidth + 1];
                    }

                    openWidth = w0;
                } while (cache.get(x) < openWidth);

                openWidth = cache.get(x);
                if (openWidth != 0) {
                    stack.push([x0, w0]);
                }
            }
        }
    }

    return {
        x: bestLowerLeft[0],
        y: Math.max(0, bestUpperRight[1]),
        w: 1 + bestUpperRight[0] - bestLowerLeft[0],
        h: 1 + bestLowerLeft[1] - bestUpperRight[1],
        area: bestArea,
        perimeter: bestPerimeter,
    };
}

const findRectsInArea = (matrix, search, minArea = 8, minPerimeter = 1, prevBiggest) => {
    if (!minArea) {
        minArea = 8;
    }

    search = {
        x: 0,
        y: 0,
        w: matrix[0].length,
        h: matrix.length,
        ...(search || {}),
    };

    if (minArea > (search.w * search.h)
        || (minPerimeter && minPerimeter > (search.w + search.h))) {
        return {
            totalArea: prevBiggest.area,
            output: [prevBiggest],
        };
    }

    const biggest = findBiggestRect(matrix, search);
    if (minArea > biggest.area
        || (minPerimeter && biggest.perimeter < minPerimeter)) {
        return {
            totalArea: prevBiggest.area,
            output: [prevBiggest],
        };
    }

    biggest.x += search.x;
    biggest.y += search.y;

    const horizontalOutput = [];
    let splitHorizontalArea = 0;
    let tmp = findRectsInArea(matrix, {
        ...search,
        w: biggest.x - search.x,
    }, minArea, minPerimeter, biggest);
    splitHorizontalArea += tmp.totalArea;
    horizontalOutput.push(...tmp.output);

    tmp = findRectsInArea(matrix, {
        ...search,
        x: biggest.x + biggest.w,
        w: search.x + search.w - biggest.x - biggest.w,
    }, minArea, minPerimeter, biggest);
    splitHorizontalArea += tmp.totalArea;
    horizontalOutput.push(...tmp.output);

    tmp = findRectsInArea(matrix, {
        ...search,
        x: biggest.x,
        w: biggest.w,
        h: biggest.y - search.y,
    }, minArea, minPerimeter, biggest);
    splitHorizontalArea += tmp.totalArea;
    horizontalOutput.push(...tmp.output);

    tmp = findRectsInArea(matrix, {
        x: biggest.x,
        y: biggest.y + biggest.h,
        w: biggest.w,
        h: search.y + search.h - biggest.y - biggest.h,
    }, minArea, minPerimeter, biggest);
    splitHorizontalArea += tmp.totalArea;
    horizontalOutput.push(...tmp.output);

    const verticalOutput = [];
    let splitVerticalArea = 0;
    tmp = findRectsInArea(matrix, {
        ...search,
        h: biggest.y - search.y,
    }, minArea, minPerimeter, biggest);
    splitVerticalArea += tmp.totalArea;
    verticalOutput.push(...tmp.output);

    tmp = findRectsInArea(matrix, {
        ...search,
        y: biggest.y + biggest.h,
        h: search.y + search.h - biggest.y - biggest.h
    }, minArea, minPerimeter, biggest);
    splitVerticalArea += tmp.totalArea;
    verticalOutput.push(...tmp.output);

    tmp = findRectsInArea(matrix, {
        ...search,
        y: biggest.y,
        w: biggest.x - search.x,
        h: biggest.h,
    }, minArea, minPerimeter, biggest);
    splitVerticalArea += tmp.totalArea;
    verticalOutput.push(...tmp.output);

    tmp = findRectsInArea(matrix, {
        x: biggest.x + biggest.w,
        y: biggest.y,
        w: search.x + search.w - biggest.x - biggest.w,
        h: biggest.h,
    }, minArea, minPerimeter, biggest);
    splitVerticalArea += tmp.totalArea;
    verticalOutput.push(...tmp.output);


    const distinctPredicate = (r1, r2) => r1.x === r2.x && r1.y === r2.y && r1.w === r2.w && r1.h === r2.h;
    if (splitHorizontalArea > splitVerticalArea) {
        return {
            totalArea: splitHorizontalArea,
            output: distinct(horizontalOutput, distinctPredicate),
        };
    }
    else {
        return {
            totalArea: splitVerticalArea,
            output: distinct(verticalOutput, distinctPredicate),
        };
    }
}

const distinct = (data, predicate) => {
    return data.filter((d, i, self) => i === self.findIndex(z => predicate(z, d)));
}


const printRawTerrain = raw => {
    if (!raw) {
        return;
    }

    const visual = new RoomVisual();
    for (let y = 0; y < 50; y++) {
        for (let x = 0; x < 50; x++) {
            const code = raw[y * 50 + x];
            if (code & TERRAIN_MASK_WALL ||
                code & TERRAIN_MASK_SWAMP) {
                continue;
            }
            const color =
                (code & TERRAIN_MASK_WALL) ? "gray" :
                    (code & TERRAIN_MASK_SWAMP) ? "green" : "white";
            visual.circle(x, y, { fill: color, radius: 0.5 });
        }
    }
};

const printConvertedTerrain = raw => {
    if (!raw) {
        return;
    }

    const visual = new RoomVisual();
    for (let y = 0; y < 50; y++) {
        for (let x = 0; x < 50; x++) {
            const value = raw[y][x];
            const color = value === 1 ? "white" : "gray";
            visual.circle(x, y, { fill: color, radius: 0.5 });
        }
    }
};

const printRect = (x, y, mat) => {
    if (!mat) {
        return;
    }

    const visual = new RoomVisual();
    visual.rect(x - 0.5 + mat.left, y - 0.5 + mat.top, mat.right - mat.left + 1, mat.bottom - mat.top + 1, { stroke: "red" })
};

const printPoint = (x, y) => {
    const visual = new RoomVisual();
    visual.circle(x, y, { fill: 'white', radius: 0.5 });
}

const printRectEx = (mat) => {
    if (!mat) {
        return;
    }

    const visual = new RoomVisual();
    visual.rect(mat.x - 0.5, mat.y - 0.5, mat.w, mat.h, { stroke: "red", opacity: 0.1 })
};



const printMatrix = (x, y, mat) => {
    if (!mat) {
        return;
    }

    const visual = new RoomVisual();
    visual.rect(x - 0.5, y - 0.5, mat[0].length, mat.length, { fill: "green" })
};

const testGetRect = mat => {
    printMatrix(0, 0, mat);
    const rects = findRects(mat);
    //console.log(rects.length);

    //printRect(0, 0, rects[0]);
    for (const rect of rects) {
        printRect(0, 0, rect);
    }
}

module.exports.loop = () => {
    PathFinder.use(true);

    const test = [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ];

    const test2 = [
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
    ];

    const test3 = [
        [0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0],
    ];

    const test4 = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 1, 1, 0],
        [0, 1, 1, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ];

    const test5 = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ];

    const test6 = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 0, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0, 0, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    for (const room of Object.values(Game.rooms)) {
        const convertedTerrain = convertTerrain(room.getTerrain().getRawBuffer());
        //printConvertedTerrain(convertedTerrain);
        //printRectEx(findBiggestRect(convertedTerrain));

        const result = findRectsInArea(convertedTerrain, null, 133);
        let selectedRect = result.output[0];

        const sources = room.find(FIND_SOURCES);

        const pathTotals = [];
        for (const rect of result.output) {
            let pathTotal = 0;
            const centre = {
                x: Math.floor(rect.x + (rect.w / 2)),
                y: Math.floor(rect.y + (rect.h / 2)),
            };

            const centreRoomPosition = new RoomPosition(centre.x, centre.y, room.name);

            const path = room.findPath(centreRoomPosition, room.controller.pos);
            pathTotal += path.length
            pathTotals.push(pathTotal);
        }

        let currentMinPath = 0;
        let currentMin = 0;
        for (let i = 0; i < pathTotals.length; i++) {
            const rect = result.output[i];
            const pathTotal = pathTotals[i];

            if (pathTotal < currentMinPath) {
                currentMinPath = pathTotal;
                currentMin = i;
            }
        }

        selectedRect = result.output[currentMin];
        printRectEx(selectedRect);

        const centre = {
            x: Math.floor(selectedRect.x + (selectedRect.w / 2)),
            y: Math.floor(selectedRect.y + (selectedRect.h / 2)),
        };

        printPoint(centre.x, centre.y);
        const centreRoomPosition = new RoomPosition(centre.x, centre.y, room.name);

        for (const src of sources) {
            const path = room.findPath(centreRoomPosition, src.pos);

            for (let i = 1; i < path.length; i++) {
                room.visual.line(path[i - 1].x, path[i - 1].y, path[i].x, path[i].y, { color: "yellow" });
            }
        }

        const path = room.findPath(centreRoomPosition, room.controller.pos);
        for (let i = 1; i < path.length; i++) {
            room.visual.line(path[i - 1].x, path[i - 1].y, path[i].x, path[i].y, { color: "green" });
        }
    }
}
