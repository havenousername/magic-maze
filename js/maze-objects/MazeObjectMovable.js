class MazeObjectMovable {
    #mazeObject
    constructor(mazeObject) {
        this.#mazeObject = mazeObject;
    }

    move(x,y) {
        this.canvasContext.save();
        const image = new Image();
        image.onload = () => {
            this.canvasContext.save();
            this.canvasContext
            .setTransform(1, 0, 0, 1, x, y);
            this.canvasContext.rotate(this.radRotation);
            this.canvasContext.drawImage(
                image,
                - x,
                - y,
                this.position.width,
                this.position.height
                );
            this.canvasContext.restore();
        };
        image.src = this.src;
    }

    initObject() {
        this.#mazeObject.initObject();
    }

    get position() {
        return this.#mazeObject.position;
    }

    get src() {
        return this.#mazeObject.src;
    }

    get canvasContext() {
        return this.#mazeObject.canvasContext;
    }

    get radRotation() {
        return this.#mazeObject.radRotation;
    }

    get halfSize() {
        return this.#mazeObject.radRotation;
    }

    get center() {
        return this.#mazeObject.center;
    }
}

export { MazeObjectMovable };