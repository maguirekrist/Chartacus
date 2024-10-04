
export interface Observer {
    notify(): void;
}

export class GraphRange {
    private _begin: number;
    private _end: number;
    private _center: number;
    private _delta: number;

    private _observers: Observer[] = [];

    constructor(begin: number, end: number)
    {
        this.update(begin, end);
    }

    addObserver(observer: Observer)
    {
        this._observers.push(observer);
    }

    removeObserver(observer: Observer)
    {
        this._observers = this._observers.filter(obs => obs !== observer);
    }

    private notifyObservers()
    {
        for(const observer of this._observers)
        {
            observer.notify();
        }
    }

    get begin() {
        return this._begin;
    }

    get end() {
        return this._end;
    }

    get center()
    {
        return this._center;
    }

    get delta()
    {
        return this._delta;
    }

    update(begin: number, end: number)
    {
        this._begin = begin;
        this._end = end;
        this._delta = end - begin;
        this._center = (this._delta / 2);
        this.notifyObservers();
    }

    shift(delta: number)
    {
        this.update(this.begin + delta, this.end + delta);
    }
}