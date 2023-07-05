import { cross, distance, lerp } from "../utils/mathUtils";
import { Coordinate } from "./data";


export class Polygon {
    points: Coordinate[] = [];
    children: Polygon[] = [];
    area = 0.0;


    // bezier discretization
    private MAX_BEZIER_STEPS = 1.0;
    private BEZIER_STEP_SIZE = 1.0;
    // this is for inside checks - doesn't have to be particularly
    // small because glyphs have finite resolution
    private EPSILON = 1e-6;
    
    moveTo(p: Coordinate) {
      this.points.push(p);
    }
  
    lineTo(p: Coordinate) {
      this.points.push(p);
    }
  
    close() {
      let cur = this.points[this.points.length - 1];
      this.points.forEach(next => {
        this.area += 0.5 * cross(cur, next);
        cur = next;
      });
    }
  
    conicTo(p: Coordinate, p1: Coordinate) {
      const p0 = this.points[this.points.length - 1];
      const dist = distance(p0, p1) + distance(p1, p);
      const steps = Math.max(2, Math.min(this.MAX_BEZIER_STEPS, dist / this.BEZIER_STEP_SIZE));
      for (let i = 1; i <= steps; ++i) {
        const t = i / steps;
        this.points.push(lerp(lerp(p0, p1, t), lerp(p1, p, t), t));
      }
    }
  
    cubicTo(p: Coordinate, p1: Coordinate, p2: Coordinate) {
      const p0 = this.points[this.points.length - 1];
      const dist = distance(p0, p1) + distance(p1, p2) + distance(p2, p);
      const steps = Math.max(2, Math.min(this.MAX_BEZIER_STEPS, dist / this.BEZIER_STEP_SIZE));
      for (let i = 1; i <= steps; ++i) {
        const t = i / steps;
        const a = lerp(lerp(p0, p1, t), lerp(p1, p2, t), t);
        const b = lerp(lerp(p1, p2, t), lerp(p2, p, t), t);
        this.points.push(lerp(a, b, t));
      }
    }
  
    inside(p: Coordinate) {
      let count = 0, cur = this.points[this.points.length - 1];
      this.points.forEach(next => {
        const p0 = (cur.y < next.y ? cur : next);
        const p1 = (cur.y < next.y ? next : cur);
        if (p0.y < p.y + this.EPSILON && p1.y > p.y + this.EPSILON) {
          if ((p1.x - p0.x) * (p.y - p0.y) > (p.x - p0.x) * (p1.y - p0.y)) {
            count += 1;
          }
        }
        cur = next;
      });
      return (count % 2) !== 0;
    }
  }