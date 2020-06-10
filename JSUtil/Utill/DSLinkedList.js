/**
 * @Author DY
 */
import Check from './Check.js';
import ObjectUtil from "./ObjectUtil.js";

export default class DSLinkedList {
    constructor(array) {
        if (!Check.Array(array)) {
            throw new Error("array needed.");
        }
        if (array.length < 1) {
            throw new Error("data needed.")
        }
        this.head = new DSLinkedListNode(array[0]);
        this.current = this.head;
        for (let i = 1; i < array.length; i++) {
            this.current.addNext(new DSLinkedListNode(array[i]));
            this.current = this.current.next;
        }
        this.tail = this.current;
        this.current = this.head;
    }

    goPrev() {
        if (this.current !== this.head) {
            this.current = this.current.prev;
        }
        return this;
    }

    removePrev() {
        let ret = this.current.removePrev();
        if (this.head === ret) {
            this.head = this.current;
        }
        return ret;
    }

    addPrev(node) {
        if (!(node instanceof DSLinkedListNode)) {
            node = new DSLinkedListNode(node);
        }
        this.current.addPrev(node);
        if (this.head === this.current) {
            this.head = node;
        }
        return this;
    }

    goNext() {
        if (this.current !== this.tail) {
            this.current = this.current.next;
        }
        return this;
    }

    removeNext() {
        let ret = this.current.removeNext();
        if (this.tail === ret) {
            this.tail = this.current;
        }
        return ret;
    }

    addNext(node) {
        if (!(node instanceof DSLinkedListNode)) {
            node = new DSLinkedListNode(node);
        }
        this.current.addNext(node);
        if (this.current === this.tail) {
            this.tail = node;
        }
        return this;
    }

    removeCurrent() {
        let ret = undefined;
        if (this.current === this.head) {
            let move = this.current.next;
            if (!Check.checkDefined(move)) {
                console.log('链表内只有一个元素，如需删除请调用destroy');
                return ret;
            }
            this.head = move;
            this.current.next = undefined;
            this.current = this.head;
        } else if (this.current === this.tail) {
            let move = this.current.prev;
            if (!Check.checkDefined(move)) {
                console.log('链表内只有一个元素，如需删除请调用destroy');
                return ret;
            }
            this.tail = move;
            this.current.prev = undefined;
            this.current = this.tail;
        } else {
            ret = this.current;
            let prev = ret.prev;
            let next = ret.next;
            ret.prev = undefined;
            ret.next = undefined;
            prev.next = next;
            next.prev = prev;
            this.current = prev;
        }
        return ret;
    }

    /**
     * 重设头位置
     * @param node
     * @date 2019/7/3
     * @methodOf: DoubleSideLinkedList
     * @Author: DY
     */
    setHead(node) {
        if (!(node instanceof DSLinkedListNode)) {
            node = new DSLinkedListNode(node);
        }
        this.head = node;
        this.current = node;
        this.head.prev = undefined;
        return this;
    }

    addHeadPrev(node) {
        if (!(node instanceof DSLinkedListNode)) {
            node = new DSLinkedListNode(node);
        }
        this.head.addPrev(node);
        this.head = node;
        this.head.prev = undefined;
        return this;
    }

    addHeadNext(node) {
        if (!(node instanceof DSLinkedListNode)) {
            node = new DSLinkedListNode(node);
        }
        this.head.addNext(node);
        return this;
    }

    goHead() {
        this.current = this.head;
        return this;
    }

    setTail(node) {
        if (!(node instanceof DSLinkedListNode)) {
            node = new DSLinkedListNode(node);
        }
        this.tail = node;
        this.current = this.head;
        this.tail.next = undefined;
        return this;
    }

    addTailPrev(node) {
        if (!(node instanceof DSLinkedListNode)) {
            node = new DSLinkedListNode(node);
        }
        this.tail.addPrev(node);
        return this;
    }

    addTailNext(node) {
        if (!(node instanceof DSLinkedListNode)) {
            node = new DSLinkedListNode(node);
        }
        this.tail.addNext(node);
        this.tail = node;
        this.tail.next = undefined;
        return this;
    }

    goTail() {
        this.current = this.tail;
        return this;
    }

    toArray(fromHead = true) {
        let targetNode = fromHead ? this.head : this.current;
        let ret = [];
        ret.push(targetNode.data);
        while (Check.checkDefined(targetNode.next)) {
            targetNode = targetNode.next;
            ret.push(targetNode.data);
        }
        return ret;
    }

    destroy() {
        let current = this.head;
        while (Check.checkDefined(current.next)) {
            let remove = this.head.removeNext();
            ObjectUtil.delete(remove);
        }
        ObjectUtil.delete(current);
        ObjectUtil.delete(this);
    }
}


class DSLinkedListNode {
    constructor(data, prev, next) {
        this.data = data;
        this.prev = prev;
        this.next = next;
    }

    removePrev() {
        if (!Check.checkDefined(this.prev)) {
            return this.prev;
        }
        let toRemove = this.prev;
        if (!Check.checkDefined(toRemove)) {
            return toRemove;
        }
        let ahead = toRemove.prev;
        if (Check.checkDefined(ahead)) {
            ahead.next = this;
        }
        toRemove.prev = undefined;
        toRemove.next = undefined;
        this.prev = ahead;
        return toRemove;
    }

    addPrev(node) {
        if (!(node instanceof DSLinkedListNode)) {
            node = new DSLinkedListNode(node);
        }
        let prev = this.prev;
        if (Check.checkDefined(prev)) {
            prev.next = node;
            node.prev = prev;
        }
        node.next = this;
        this.prev = node;
    }

    removeNext() {
        if (!Check.checkDefined(this.next)) {
            return this.next;
        }
        let toRemove = this.next;
        if (!Check.checkDefined(toRemove)) {
            return toRemove;
        }
        let after = toRemove.next;
        if (Check.checkDefined(after)) {
            after.prev = this;
        }
        toRemove.prev = undefined;
        toRemove.next = undefined;
        this.next = after;
        return toRemove;
    }

    addNext(node) {
        if (!(node instanceof DSLinkedListNode)) {
            node = new DSLinkedListNode(node);
        }
        let next = this.next;
        if (Check.checkDefined(next)) {
            next.prev = node;
            node.next = next;
        }
        this.next = node;
        node.prev = this;
    }
}
