import {Group} from "../src/Geometry/Group.js";
import {Check} from "../Check/Check.js";

class Group_Modified extends Group {
    constructor() {
        super();
        this.hostClass;
    }

    loadRootModel(arr) {
        if (Check.undefine(arr)) return;
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].loadRootModel !== undefined) {
                this.children[i].loadRootModel(arr);
            } else {
                arr.push(this.children[i]);
            }
        }
    }
}

export {Group_Modified};