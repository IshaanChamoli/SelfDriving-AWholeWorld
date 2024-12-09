class Graph {
    constructor(points = [], segments = []) {
        this.points = points;
        this.segments = segments;
    }

    static load(info) {
        if (!info || !info.points || !info.segments) {
            return new Graph();
        }

        const points = info.points.map(p => {
            if (typeof p.x === 'number' && typeof p.y === 'number') {
                return new Point(p.x, p.y);
            }
            return null;
        }).filter(p => p !== null);

        const segments = info.segments.map(s => {
            if (!s.p1 || !s.p2) return null;
            
            const p1 = points.find(p => p.x === s.p1.x && p.y === s.p1.y);
            const p2 = points.find(p => p.x === s.p2.x && p.y === s.p2.y);
            
            if (!p1 || !p2) return null;
            
            return new Segment(p1, p2);
        }).filter(s => s !== null);

        return new Graph(points, segments);
    }

    hash() {
        return JSON.stringify(this);
    }


    addPoint(point) {
        this.points.push(point);
    }

    containsPoint(point) {
        return this.points.find((p) => p.equals(point))
    }

    tryAddPoint(point) {
        if (!this.containsPoint(point)) {
            this.addPoint(point);
            return true;
        }
        return false;
    }

    removePoint(point) {
        const segs = this.getSegmentsWithPoint(point);
        for (const seg of segs) {
            this.removeSegment(seg);
        }
        this.points.splice(this.points.indexOf(point), 1);
    }



    addSegment(seg) {
        this.segments.push(seg);
    }

    containsSegment(seg) {
        return this.segments.find((s) => s.equals(seg));
    }

    tryAddSegment(seg) {
        if (!this.containsSegment(seg) && !seg.p1.equals(seg.p2)) {
            this.addSegment(seg);
            return true;
        }
        return false;
    }

    removeSegment(seg) {
        this.segments.splice(this.segments.indexOf(seg), 1);
    }

    getSegmentsWithPoint(point) {
        const segs = [];
        for (const seg of this.segments) {
            if (seg.includes(point)) {
                segs.push(seg);
            }
        }
        return segs;
    }




    dispose() {
        this.points = [];
        this.segments = [];
    }

    draw(ctx) {
        for (const seg of this.segments) {
            seg.draw(ctx);
        }

        for (const point of this.points) {
            point.draw(ctx);
        }
    }
}