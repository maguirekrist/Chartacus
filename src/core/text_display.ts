

export class TextDisplay {
    _xNode: Text;
    _yNode: Text;
    _zoomNode: Text;

    constructor()
    {
        this.initializeText();
    }

    updateText(x: number, y: number, zoom: number) {
        this._xNode.nodeValue = x.toFixed(2);
        this._yNode.nodeValue = y.toFixed(2);
        this._zoomNode.nodeValue = zoom.toString();
    }

    private initializeText() {
        // look up the elements we want to affect
        var xElement = document.querySelector("#x-coord");
        var yElement = document.querySelector("#y-coord");
        var zoomElement = document.querySelector("#zoom");
        
        // Create text nodes to save some time for the browser
        // and avoid allocations.
        var xNode = document.createTextNode("");
        var yNode = document.createTextNode("");
        var zoomNode = document.createTextNode("");
        
        // Add those text nodes where they need to go
        xElement.appendChild(xNode);
        yElement.appendChild(yNode);
        zoomElement.appendChild(zoomNode);
    
        this._xNode = xNode;
        this._yNode = yNode;
        this._zoomNode = zoomNode;
    }
}