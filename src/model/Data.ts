

export interface Point {
    x: number;
    y: number;
}

export interface Drawable {
    render(): void;
}

export type Series = Point[];

