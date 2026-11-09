import { connect } from "node:net";

export async function scanDocument(bytes: Uint8Array, socketPath = process.env.CRM_CLAMD_SOCKET) {
  if (!socketPath?.startsWith("/")) {
    throw new Response("Document scanning is unavailable. No file was saved.", { status: 503 });
  }

  const verdict = await new Promise<string>((resolve, reject) => {
    const socket = connect(socketPath);
    let reply = "";
    const deadline = setTimeout(() => finish(new Error("Scan timed out")), 30_000);
    function finish(error?: Error, result?: string) {
      clearTimeout(deadline);
      socket.destroy();
      if (error) reject(error);
      else resolve(result!);
    }

    socket.on("error", finish);
    socket.once("close", () => finish(new Error("Incomplete scanner reply")));
    socket.once("connect", () => {
      const length = Buffer.alloc(4);
      length.writeUInt32BE(bytes.byteLength);
      socket.write("zINSTREAM\0");
      socket.write(length);
      socket.write(bytes);
      socket.write(Buffer.alloc(4));
    });
    socket.on("data", (chunk: Buffer) => {
      reply += chunk.toString("ascii");
      if (reply.length > 1024) return finish(new Error("Invalid scanner reply"));
      if (reply.includes("\0")) finish(undefined, reply);
    });
  }).catch(() => "");
  if (/^stream: [^\0\r\n]+ FOUND\0$/.test(verdict)) {
    throw new Response("The file failed the security scan. No file was saved.", { status: 422 });
  }
  if (verdict !== "stream: OK\0") {
    throw new Response("Document scanning is unavailable. No file was saved.", { status: 503 });
  }
}
