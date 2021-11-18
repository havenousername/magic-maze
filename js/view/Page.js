class Page {
    #nextPages;

    constructor() {
        this.#nextPages = [];
    }

    setNext(page) {
        this.#nextPages.push(page);
        return page;
    }

    handle(request) {
        for (const nextPage of this.#nextPages) {
            const handler = nextPage.handle(request);
            if (handler) {
                return handler;
            }
        }

        return null;
    } 
}

export { Page };