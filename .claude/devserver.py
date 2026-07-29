"""Static dev server with HTTP Range support.

python -m http.server does NOT implement Range, so browsers report the served
video as non-seekable (video.seekable == [0,0]) and every currentTime
assignment silently clamps to 0 — which makes a scroll-scrubbed video look
frozen on its first frame. GitHub Pages does support Range, so this only
matters locally; this server reproduces production behaviour.

    python .claude/devserver.py [port]
"""
import http.server
import os
import re
import socketserver
import sys

RANGE_RE = re.compile(r"bytes=(\d*)-(\d*)")


class RangeRequestHandler(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        self._range_remaining = None
        path = self.translate_path(self.path)
        if os.path.isdir(path) or not self.headers.get("Range"):
            return super().send_head()

        try:
            f = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        size = os.fstat(f.fileno()).st_size
        match = RANGE_RE.match(self.headers["Range"])
        if not match:
            f.close()
            self.send_error(400, "Malformed Range header")
            return None

        raw_start, raw_end = match.group(1), match.group(2)
        if raw_start == "":
            # suffix range: last N bytes
            length = int(raw_end or 0)
            start = max(0, size - length)
            end = size - 1
        else:
            start = int(raw_start)
            end = int(raw_end) if raw_end else size - 1
        end = min(end, size - 1)

        if start > end or start >= size:
            f.close()
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{size}")
            self.end_headers()
            return None

        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(end - start + 1))
        self.end_headers()
        f.seek(start)
        self._range_remaining = end - start + 1
        return f

    def copyfile(self, source, outputfile):
        remaining = getattr(self, "_range_remaining", None)
        if remaining is None:
            return super().copyfile(source, outputfile)
        while remaining > 0:
            chunk = source.read(min(64 * 1024, remaining))
            if not chunk:
                break
            outputfile.write(chunk)
            remaining -= len(chunk)
        self._range_remaining = None

    def end_headers(self):
        # Advertise seekability on every response, including the initial 200 —
        # browsers use this to decide whether a media resource can be seeked.
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


class Server(socketserver.ThreadingTCPServer):
    daemon_threads = True
    allow_reuse_address = True


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8127
    with Server(("127.0.0.1", port), RangeRequestHandler) as httpd:
        print(f"serving {os.getcwd()} on http://localhost:{port} (Range enabled)")
        httpd.serve_forever()
