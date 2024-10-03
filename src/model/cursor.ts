import { IDrawable, RendererVistor } from "../core/renderer";


class Cursor implements IDrawable {
    accept(visitor: RendererVistor): void {
        throw new Error("Method not implemented.");
    }
}