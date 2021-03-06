/**
 * @Author DY
 */
import * as adapter from "./adapter_no_global"

class Check {
    static string(input) {
        return Check.checkDefined(input) && (typeof input === 'string' || input instanceof String);
    }

    static Array(input) {
        return Check.checkDefined(input) && Array.isArray(input);
    }

    static checkDefined(input) {
        return input !== undefined && input !== null;
    }

}

class ArrayUtil {
    static removeIndex(index, array) {
        if (index === -1) {
            return undefined;
        }
        if (index === 0) {
            return array.shift();
        }
        if (index === array.length - 1) {
            return array.pop();
        }
        return array.splice(index, 1)[0];
    }
}

class ObjectUtil {
    static delete(object) {
        if (!Check.checkDefined(object)) return;
        for (let name in object) {
            if (!object.hasOwnProperty(name)) continue;
            if (Check.Array(object[name])) {
                while (object[name].length > 0) {
                    let a = object[name].pop();
                    if (Check.Object(a)) {
                        if (a.destroy) {
                            try {
                                a.destroy();
                            } catch (e) {
                                ObjectUtil.delete(a);
                            }
                        } else {
                            ObjectUtil.delete(a);
                        }
                    } else {
                        a = null;
                    }
                }
            }
            object[name] = null;
            delete object[name];
        }
    }


    static getSuperClass(target, time = 0) {
        let tmp = Object.getPrototypeOf(target);
        while (time > 0) {
            tmp = Object.getPrototypeOf(tmp);
            time--;
        }
        let targetOwn = Object.getOwnPropertyNames(tmp);
        tmp = tmp.__proto__;
        tmp = Object.getOwnPropertyNames(tmp);
        for (let i = 0; i < tmp.length; i++) {
            if (targetOwn.indexOf(tmp[i]) !== -1) {
                ArrayUtil.removeIndex(i--, tmp);
            }
        }
        return tmp;
    }

    static setProperties(target, obj, source) {
        let boolean = Check.Array(target);
        let temp = boolean ? target : Object.getOwnPropertyNames(Object.getPrototypeOf(target));
        for (let i = 0; i < temp.length; i++) {
            let name = temp[i];
            if (name === "setShow" || name === "setProperty" || name === "setAttr") continue;
            let index = name.indexOf("set");
            if (index === 0) {
                let tmp = name.slice(3);
                tmp = tmp.charAt(0).toLocaleLowerCase() + tmp.slice(1);
                if (Check.checkDefined(obj[tmp]) || (!boolean && !Check.checkDefined(target[tmp]) || (boolean && !Check.checkDefined(source[tmp])))) {
                    if (boolean === true) {
                        if (!Check.checkDefined(source[tmp]) || source[tmp] !== obj[tmp])
                            source[name](obj[tmp]);
                    } else {
                        target[name](obj[tmp]);
                    }
                }
            }
        }
        if (Check.checkDefined(target.setShow)) {
            target.setShow(obj.show !== false);
        }

    }
}

const enCoder = new TextEncoder();
const deCoder = new TextDecoder("utf-8");

const max = 255;

class NetLinkUtil {
    static createSocket(serverUrl, protocols, needSSl) {
        let scheme = "ws";
        if (needSSl === true) {
            scheme += "s";
        }
        serverUrl = scheme + "://" + serverUrl;
        return new WebSocket(serverUrl, protocols);
    }

    static createPeerConnection(config = {}) {
        return new RTCPeerConnection(config);
    }
}

class BinaryCodec {

    static encode(str) {
        let buffer = enCoder.encode(str);
        buffer = new Int8Array(buffer.buffer);
        for (let i = 0; i < buffer.length; i++) {
            buffer[i] = max - buffer[i];
        }
        return buffer;
    }

    static decode(arraybuffer) {
        let buffer = new Int8Array(arraybuffer);
        let lenght = buffer.length;
        for (let i = 0; i < lenght; i++) {
            buffer[i] = max - buffer[i];
        }
        return deCoder.decode(buffer);
    }
}

export default class CreateLink {
    constructor(obj = {}) {
        this.setProperty(obj);
        this.webSocket = undefined;
        this.peerConnection = undefined;
    }

    _sendToServer(msg) {
        if (!Check.checkDefined(this.webSocket)) {
            return;
        }
        this.webSocket.send(BinaryCodec.encode(JSON.stringify(msg)));
    }

    _loadSetData(data) {
        let msg = JSON.parse(data);
        switch (msg.type) {
            case "geoLocation":
                this.onGeoLocationChange(msg);
                break;
            case "orientation":
                this.onOrientationChange(msg);
                break;
            case "userlist":
                break;
            case "iceConfig":
                this.iceConfig = msg.data;
                break;
            case "id":
                this.id = msg.id;
                if (!this.iceConfig) {
                    this._sendToServer({
                        type: "loadICEConfig",
                        id: this.id,
                        token: this.id
                    })
                }
                if (!this.adminName) {
                    this._sendToServer({
                        type: "requestAdminName",
                        id: this.id,
                        token: this.id
                    })
                }
                break;
            case "AdminName":
                this.name = msg.name;
                break;
            case "video-offer":
                this._handleVideoOfferMsg(msg);
                break;
            case "video-answer":
                this._handleVideoAnswerMsg(msg);
                break;
            case "new-ice-candidate":
                this._handleNewICECandidateMsg(msg);
                break;
            case "hang-up":
                this._endPeerLink(msg);
                break;
            default:
                this.onerror("Unknown message received:");
                this.onerror(msg);
        }
    }

    async _handleVideoOfferMsg(msg) {
        const targetUsername = msg.name;

        let flag = this.onInvite(msg);

        if (flag === false) {
            this._endPeerLink();
            return;
        }

        if (!Check.checkDefined(this.peerConnection)) {
            this._startPeerLink();
        }
        let desc = new RTCSessionDescription(msg.sdp);
        if (this.peerConnection.signalingState !== "stable") {
            await Promise.all([
                this.peerConnection.setLocalDescription({type: "rollback"}),
                this.peerConnection.setRemoteDescription(desc)
            ]);
            return;
        } else {
            await this.peerConnection.setRemoteDescription(desc);
        }

        await this.peerConnection.setLocalDescription(await this.peerConnection.createAnswer());

        this.connectPeer = targetUsername;
        this._sendToServer({
            name: this.adminName,
            target: targetUsername,
            type: "video-answer",
            sdp: this.peerConnection.localDescription
        });
    }

    async _handleVideoAnswerMsg(msg) {
        if (!Check.checkDefined(this.peerConnection)) {
            return;
        }
        let desc = new RTCSessionDescription(msg.sdp);
        await this.peerConnection.setRemoteDescription(desc).catch((error) => {
            this._endPeerLink();
            this.onerror(error)
        });
    }

    async _handleNewICECandidateMsg(msg) {
        if (!Check.checkDefined(this.peerConnection)) {
            return;
        }
        let candidate = new RTCIceCandidate(msg.candidate);
        try {
            await this.peerConnection.addIceCandidate(candidate);
        } catch (err) {
            this.onerror(err);
        }
    }

    activeSocket() {
        if (Check.checkDefined(this.webSocket)) {
            return;
        }
        this.webSocket = NetLinkUtil.createSocket(this.url, this.protocols, this.needSSL);

        this.webSocket.onclose = () => {
            this.deActiveSocket();
        };
        this.webSocket.onopen = this.onopen;
        this.webSocket.onerror = this.onerror;
        this.webSocket.onmessage = (evt) => {
            if (evt.data instanceof Blob) {
                evt.data.arrayBuffer().then((data) => {
                    this._loadSetData(BinaryCodec.decode(data));
                }, (error) => {
                    this.onerror(error);
                });
            } else {
                this._loadSetData(evt.data);
            }
        };
    }

    deActiveSocket() {
        if (Check.checkDefined(this.webSocket)) {
            this.webSocket.onclose = null;
            this.webSocket.onopen = null;
            this.webSocket.onerror = null;
            this.webSocket.onmessage = null;

            this.webSocket.close();
            this.webSocket = null;
        }
        this._endPeerLink();
    }

    async _handleNegotiationNeededEvent() {
        try {
            const offer = await this.peerConnection.createOffer();

            if (this.peerConnection.signalingState !== "stable") {
                return;
            }

            await this.peerConnection.setLocalDescription(offer);
            this._sendToServer({
                name: this.adminName,
                target: this.connectPeer,
                type: "video-offer",
                sdp: this.peerConnection.localDescription
            });
        } catch (err) {
            this._endPeerLink();
            this.onerror(err);
        }
    }

    _startPeerLink() {
        if (Check.checkDefined(this.peerConnection) || !Check.checkDefined(this.iceConfig)) {
            return;
        }

        this.videoDom = window.document.createElement("video");

        this.videoDom.crossOrigin = "*";

        this.videoDom.height = 400;
        this.videoDom.width = 600;

        this.videoDom.style.display = "none";
        this.videoDom.style.position = "absolute";
        this.videoDom.style.height = "400px";
        this.videoDom.style.width = "600px";

        this.parentDom.appendChild(this.videoDom);

        this.peerConnection = NetLinkUtil.createPeerConnection(this.iceConfig);

        this.peerConnection.ontrack = this.ontrack;
        this.peerConnection.onicecandidate = (evt) => {
            if (evt.candidate) {
                this._sendToServer({
                    type: "new-ice-candidate",
                    target: this.connectPeer,
                    candidate: evt.candidate
                });
            }
        };
        this.peerConnection.oniceconnectionstatechange = () => {
            switch (this.peerConnection.iceConnectionState) {
                case "closed":
                case "failed":
                case "disconnected":
                    this._endPeerLink();
                    break;
            }
        };
        this.peerConnection.onsignalingstatechange = () => {
            switch (this.peerConnection.signalingState) {
                case "closed":
                    this._endPeerLink();
                    break;
            }
        };
        this.peerConnection.onicegatheringstatechange = (evt) => {
            // myPeerConnection.iceGatheringState;
        };
        this.peerConnection.onnegotiationneeded = this._handleNegotiationNeededEvent;
    }

    _endPeerLink() {
        if (Check.checkDefined(this.peerConnection)) {
            if (Check.checkDefined(this.videoDom)) {
                if (this.videoDom.srcObject) {
                    this.videoDom.pause();
                    this.videoDom.srcObject.getTracks().forEach(track => {
                        if (Check.checkDefined(track) && track.stop) {
                            track.stop();
                        }
                    });
                }
                this.parentDom.removeChild(this.videoDom);
                this.videoDom = null;
            }
            this.peerConnection.ontrack = null;
            this.peerConnection.onicecandidate = null;
            this.peerConnection.oniceconnectionstatechange = null;
            this.peerConnection.onsignalingstatechange = null;
            this.peerConnection.onicegatheringstatechange = null;
            this.peerConnection.onnegotiationneeded = null;

            this.peerConnection.getTransceivers().forEach(transceiver => {
                if (Check.checkDefined(transceiver) && transceiver.stop) {
                    transceiver.stop();
                }
            });

            this.peerConnection.close();
            this.peerConnection = null;

            if (this.connectPeer) {
                this._sendToServer({
                    name: this.adminName,
                    target: this.connectPeer,
                    type: "hang-up"
                });
                this.connectPeer = null;
            }

            this.onEndConnection(this);
        }
    }

    setProperty(obj) {
        ObjectUtil.setProperties(this, obj);
    }

    setUrl(url) {
        this.url = url;
        return this;
    }

    setNeedSSL(needSSL) {
        this.needSSL = needSSL === true;
        return this;
    }

    setOnGeoLocationChange(onGeoLocationChange) {
        this.onGeoLocationChange = Check.checkDefined(onGeoLocationChange) ? onGeoLocationChange : () => {
        };
        return this;
    }

    setOnOrientationChange(onOrientationChange) {
        this.onOrientationChange = Check.checkDefined(onOrientationChange) ? onOrientationChange : () => {
        };
        return this;
    }

    setOnInvite(onInvite) {
        this.onInvite = Check.checkDefined(onInvite) ? onInvite : () => {
        };
        return this;
    }

    setProtocols(protocols) {
        this.protocols = Check.checkDefined(protocols) ? protocols : "json";
        return this;
    }

    setOnopen(onopen) {
        this.onopen = Check.checkDefined(onopen) ? onopen : () => {
        };
        return this;
    }

    setOntrack(ontrack) {
        this.ontrack = Check.checkDefined(ontrack) ? ontrack : () => {
        };
        return this;
    }

    setOnEndConnection(onEndConnection) {
        this.onEndConnection = Check.checkDefined(onEndConnection) ? onEndConnection : () => {
        }
        return this;
    }

    setOnConnection(onConnection) {
        this.onConnection = Check.checkDefined(onConnection) ? onConnection : () => {
        };
        return this;
    }

    setOnerror(onerror) {
        this.onerror = Check.checkDefined(onerror) ? onerror : () => {
        };
        return this;
    }

    setParentDom(parentDom) {
        this.parentDom = Check.checkDefined(parentDom) ? parentDom : window.document.body;
        if (Check.string(this.parentDom)) {
            this.parentDom = window.document.getElementById(this.parentDom);
        }
        return this;
    }

    destroy() {
        this.deActiveSocket();
        this.parentDom = null;
        ObjectUtil.delete(this);
    }
}