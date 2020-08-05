const enCoder = new TextEncoder();
const deCoder = new TextDecoder("utf-8");
const max = 255;
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
