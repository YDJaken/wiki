/**
 * @Author DY
 */
import {dependencies} from "../Constants";

export default class NetLinkUtil {
    static createSocket(serverUrl, protocols) {
        let scheme = "ws";
        if (dependencies.top.document.location.protocol === "https:") {
            scheme += "s";
        }
        serverUrl = scheme + "://" + serverUrl;
        return new WebSocket(serverUrl, protocols);
    }

    static createPeerConnection(config = {}) {
        return new RTCPeerConnection(config);
    }
}