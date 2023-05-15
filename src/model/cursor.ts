import { IDrawable, RendererVistor } from "../renderer";


class Cursor implements IDrawable {
    accept(visitor: RendererVistor): void {
        throw new Error("Method not implemented.");
    }
}