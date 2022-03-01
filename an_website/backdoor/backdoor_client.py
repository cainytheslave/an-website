#!/bin/env python3
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

"""The client for the backdoor API of the website."""
from __future__ import annotations, barry_as_FLUFL

import ast
import asyncio
import http.client
import os
import pickle
import pydoc
import re
import socket
import sys
import time
import traceback
import urllib.parse
import uuid
from typing import Any, Union, overload

try:
    import hy  # type: ignore
except ImportError:
    hy = None

try:
    import socks  # type: ignore
except ImportError:
    socks = None

try:
    import uvloop
except ImportError:
    pass
else:
    uvloop.install()


E = eval(  # pylint: disable=eval-used
    "eval(repr((_:=[],_.append(_))[0]))[0][0]"
)

# proxy_type, addr, port, rdns, username, password
Proxy = Union[  # pylint: disable=consider-alternative-union-syntax
    tuple[int, str],
    tuple[int, str, None | int],
    tuple[int, str, None | int, None | bool],
    tuple[int, str, None | int, None | bool, None | str, None | str],
]


@overload
async def create_socket(  # noqa: D103
    hostname: str,
    port: int | str,
    proxy: None,
) -> socket.socket:
    ...


@overload
async def create_socket(  # noqa: D103
    hostname: str,
    port: int | str,
    proxy: Proxy,
) -> socks.socksocket:
    ...


async def create_socket(
    hostname: str,
    port: int | str,
    proxy: None | Proxy = None,
) -> socket.socket | socks.socksocket:
    """Create a socket (optionally with a proxy)."""
    # pylint: disable=too-complex
    if proxy and not socks:
        raise ValueError("PySocks is required for proxy support")
    loop = asyncio.get_running_loop()
    address_infos = await loop.getaddrinfo(
        hostname,
        port,
        type=socket.SOCK_STREAM,
    )
    if not address_infos:
        raise OSError("getaddrinfo() returned empty list")
    exceptions = []
    for address_info in address_infos:
        sock = None
        try:
            sock = (
                socks.socksocket(
                    address_info[0], address_info[1], address_info[2]
                )
                if proxy
                else socket.socket(
                    address_info[0], address_info[1], address_info[2]
                )
            )
            sock.setblocking(False)
            if proxy:
                sock.set_proxy(*proxy)  # pylint: disable=no-member
            await loop.sock_connect(sock, address_info[4])
            return sock
        except OSError as exc:
            if sock is not None:
                sock.close()
            exceptions.append(exc)
            continue
        except BaseException:
            if sock is not None:
                sock.close()
            raise
    if len(exceptions) == 1:
        raise exceptions[0]
    # If they all have the same str(), raise one.
    model = str(exceptions[0])
    if all(str(exc) == model for exc in exceptions):
        raise exceptions[0]
    # Raise a combined exception so the user can see all the various error messages.
    raise OSError(
        f"Multiple exceptions: {', '.join(str(exc) for exc in exceptions)}"
    )


async def request(  # noqa: D103
    method: str,
    url: str | urllib.parse.SplitResult | urllib.parse.ParseResult,
    headers: dict[Any, Any],
    body: str | bytes,
    *,
    proxy: None | Proxy = None,
) -> tuple[int, dict[str, str], bytes]:
    # pylint: disable=invalid-name, line-too-long, missing-function-docstring, while-used
    if isinstance(body, str):
        body = body.encode("utf-8")
    if isinstance(url, str):
        url = urllib.parse.urlsplit(url)
    if url.scheme not in {"", "http", "https"}:
        raise ValueError(f"Unsupported scheme: {url.scheme}")
    if not url.hostname:
        raise ValueError("URL has no hostname")
    https = url.scheme == "https"
    header_names = [x.strip().title() for x in headers.keys()]
    if "Host" not in header_names:
        headers["Host"] = url.netloc
    if body and "Content-Length" not in header_names:
        headers["Content-Length"] = len(body)
    e, data = E, b""
    sock = await create_socket(
        url.hostname,
        url.port or ("https" if https else "http"),
        proxy,
    )
    reader, writer = await asyncio.open_connection(
        sock=sock,
        ssl=https,
        server_hostname=url.hostname if https else None,
    )
    writer.write(
        (
            method
            + " "
            + (url.path or "/")
            + ("?" + url.query if url.query else "")
            + " HTTP/1.0\r\n"
        ).encode("ascii")
        + "\r\n".join(
            [f"{key}:{value}" for key, value in headers.items()] + [""]
        ).encode("latin-1")
        + b"\r\n"
        + body
    )
    await writer.drain()
    while chunk := await reader.read():
        if b"\r\n\r\n" in (data := data + chunk) and e is E:
            e, data = data.split(b"\r\n\r\n", 1)
            status, o = re.match(r"HTTP/.+? (\d+).*?\r\n(.*)", e.decode("latin-1"), 24).groups()  # type: ignore[union-attr]
            headers = dict((re.match(r"([^\s]+):\s*(.+?)\s*$", x, 24).groups() for x in o.split("\r\n")))  # type: ignore[union-attr, misc]
    writer.close()
    await writer.wait_closed()
    if "status" not in locals():
        raise AssertionError("No HTTP response received")
    return int(status), headers, data


def detect_mode(code: str) -> str:
    """Detect which mode needs to be used."""
    try:
        ast.parse(code, mode="eval")
        return "eval"
    except SyntaxError:
        ast.parse(code, mode="exec")
        return "exec"


def send(  # pylint: disable=too-many-arguments
    url: str | urllib.parse.SplitResult | urllib.parse.ParseResult,
    key: str,
    code: str,
    mode: str = "exec",
    session: None | str = None,
    proxy: None | Proxy = None,
) -> Any:
    """Send code to the backdoor API."""
    body = code.encode("utf-8")
    if isinstance(url, str):
        url = urllib.parse.urlsplit(url)
    headers = {
        "Authorization": key,
    }
    if session:
        headers["X-Backdoor-Session"] = session
    response = asyncio.run(
        request(
            "POST",
            url._replace(path=f"{url.path}/api/backdoor/{mode}"),
            headers,
            body,
            proxy=proxy,
        )
    )
    try:
        return (
            response[0],  # status
            response[1],  # header
            pickle.loads(response[2]),  # data
        )
    except pickle.UnpicklingError:
        return (
            response[0],
            response[1],
            None,
        )


def lisp_always_active() -> bool:
    """Return True if LISP is always active."""
    return (
        hy
        and not hy.eval(
            hy.read_str(
                '(* (- (* (+ 0 1) 2 3 4 5) (+ 6 7 8 9 10 11)) '  # fmt: skip
                '(int (= (. (__import__ "os.path") sep) "/")))'
            )
        )
        and not int.from_bytes(
            getattr(
                os, "洀漀搀渀愀爀甀".encode("utf_16_be")[::-1].decode("utf_16_be")
            )(1),
            sys.byteorder,
        )
        // (69 // 4 - 1)
    )


def run_and_print(  # noqa: C901  # pylint: disable=too-many-arguments
    url: str,
    key: str,
    code: str,
    session: None | str = None,
    lisp: bool = False,
    proxy: None | Proxy = None,
    time_requests: bool = False,
) -> None:
    # pylint: disable=too-complex, too-many-branches
    """Run the code and print the output."""
    start_time = time.monotonic()
    if lisp or lisp_always_active():
        code = hy.disassemble(hy.read_str(code), True)
    try:
        response = send(url, key, code, detect_mode(code), session, proxy)
    except SyntaxError as exc:
        print(
            "".join(
                traceback.format_exception_only(exc)  # type: ignore
            ).strip()
        )
        return
    if response[0] >= 400:
        print("\033[91m" + http.client.responses[response[0]] + "\033[0m")
    if response[2] is None:
        return
    if isinstance(response[2], str):
        print("\033[91m" + response[2] + "\033[0m")
        return
    if isinstance(response[2], SystemExit):
        raise response[2]  # pylint: disable=raising-bad-type
    if isinstance(response[2], dict):
        if response[2]["success"]:
            if response[2]["output"]:
                print("Output:")
                print(response[2]["output"].strip())
            result_obj = None
            if response[2]["result"][1]:
                try:
                    result_obj = pickle.loads(response[2]["result"][1])
                except (
                    pickle.UnpicklingError,
                    AttributeError,
                    EOFError,
                    ImportError,
                    IndexError,
                ):
                    pass
                except Exception:  # pylint: disable=broad-except
                    traceback.print_exc()
            if (
                isinstance(result_obj, tuple)
                and len(result_obj) == 2
                and result_obj[0] == "HelperTuple"
                and isinstance(result_obj[1], str)
            ):
                pydoc.pager(result_obj[1])
            elif response[2]["result"][0] != "None":
                print("Result:")
                print(response[2]["result"][0])
        else:
            print(response[2]["result"][0])
    else:
        print("Response has unknown type!")
        print(response[2])
    if time_requests:
        took = time.monotonic() - start_time
        if took > 1:
            color = "91"  # red
        elif took > 0.5:
            color = "93"  # yellow
        else:
            color = "92"  # green
        print(f"\033[{color}mTook: {took:.3f}s\033[0m")


def main() -> None:  # noqa: C901
    # pylint: disable=too-complex, too-many-branches, too-many-locals, too-many-statements
    """Parse arguments, load the cache and start the backdoor client."""
    if "--help" in sys.argv or "-h" in sys.argv:
        sys.exit(
            """

Accepted arguments:

    --clear-cache      clear the whole cache
    --lisp             enable Lots of Irritating Superfluous Parentheses
    --new-proxy        don't use the cached proxy
    --new-session      start a new session with cached URL and key
    --no-cache         start without a cache
    --no-patch-help    don't patch help()
    --timing           print the time it took to execute each command

    --help or -h       show this help message

""".strip()
        )
    for arg in sys.argv[1:]:
        if arg not in {
            "--clear-cache",
            "--lisp",
            "--new-proxy",
            "--new-session",
            "--no-cache",
            "--no-patch-help",
            "--timing",
            "--help",
            "-h",
        }:
            print(f"Unknown argument: {arg}")
            sys.exit(64 + 4 + 1)
    url: None | str = None
    key: None | str = None
    session: None | str = None
    proxy: None | Proxy | tuple[()] = None
    cache_pickle = os.path.join(
        os.getenv("XDG_CACHE_HOME") or os.path.expanduser("~/.cache"),
        "an-backdoor-client/session.pickle",
    )
    if "--clear-cache" in sys.argv:
        if os.path.exists(cache_pickle):
            os.remove(cache_pickle)
        print("Cache cleared")
    if "--no-cache" not in sys.argv:
        try:
            with open(cache_pickle, "rb") as file:
                cache = pickle.load(file)
        except FileNotFoundError:
            pass
        else:
            url = cache.get("url")
            key = cache.get("key")
            session = cache.get("session")
            proxy = cache.get("proxy")
            if "--new-session" in sys.argv:
                print(f"Using URL {url}")
            else:
                print(f"Using URL {url} with existing session {session}")
    while not url:  # pylint: disable=while-used
        url = input("URL: ").strip().rstrip("/")
        if not url:
            print("No URL given!")
        elif not url.startswith(("http:", "https:")):
            if not url.startswith("//"):
                url = "//" + url
            banana = url.split("/", maxsplit=1)
            if re.fullmatch(
                r"^(\/\/)(localhost|127\.0\.0\.1|\[::1\])(\:\d+)?", banana[0]
            ):
                url = "http:" + url
            else:
                url = "https:" + url
            print(f"Using URL {url}")

    while not key:  # pylint: disable=while-used
        key = input("Key: ").strip()
        if not key:
            print("No key given!")

    if proxy is None or "--new-proxy" in sys.argv:
        proxy_url_str = input("Proxy (leave empty for none): ").strip()
        if "://" not in proxy_url_str:
            proxy_url_str = "socks5://" + proxy_url_str
        proxy_url = urllib.parse.urlsplit(proxy_url_str)
        if proxy_url_str:
            if proxy_url.hostname:
                proxy = (
                    int(socks.PROXY_TYPES[proxy_url.scheme.upper()]),
                    proxy_url.hostname,
                    proxy_url.port,
                    True,
                    proxy_url.username or None,
                    proxy_url.password or None,
                )
            else:
                print("Invalid proxy URL!")
                proxy = None
        else:
            print("No proxy given!")
    if proxy:
        port: None | int = (
            proxy[2] if len(proxy) > 2 else None  # type: ignore[misc]
        )
        print(
            f"Using {socks.PRINTABLE_PROXY_TYPES[proxy[0]]} proxy "
            f"{proxy[1]}{f':{port}' if port else ''}"
            + (
                f" with username {proxy[4]}"  # type: ignore[misc]
                if len(proxy) > 4 and proxy[4]  # type: ignore[misc]
                else ""
            )
        )
    else:
        proxy = None
        print("Using no proxy. (use --new-proxy to be able to set one)")

    if not session or "--new-session" in sys.argv:
        session = input("Session (enter nothing for random session): ")
        if not session:
            session = str(uuid.uuid4())
        print(f"Using session {session}")

    if "--no-cache" not in sys.argv:
        os.makedirs(os.path.dirname(cache_pickle), exist_ok=True)
        with open(cache_pickle, "wb") as file:
            pickle.dump(
                {
                    "url": url,
                    "key": key,
                    "session": session,
                    "proxy": proxy or (),  # not None (None == ask)
                },
                file,
            )
        print("Saved information to cache")

    if "--no-patch-help" not in sys.argv:
        code = (
            "def help(*args, **kwargs):\n"
            "    import io\n"
            "    import pydoc\n"
            "    helper_output = io.StringIO()\n"
            "    pydoc.Helper(io.StringIO(), helper_output)(*args, **kwargs)\n"
            "    return 'HelperTuple', helper_output.getvalue()"
        )
        response = send(url, key, code, "exec", session, proxy)
        if response[0] >= 400 or not response[2]["success"]:
            print("\033[91mPatching help() failed!\033[0m")

    if "--lisp" in sys.argv:
        if not hy:
            sys.exit("Hy is not installed!")
        response = send(url, key, "import hy", "exec", session, proxy)
        if response[0] >= 400 or not response[2]["success"]:
            print("\033[91mImporting Hy failed!\033[0m")

    # pylint: disable=import-outside-toplevel
    from pyrepl.python_reader import ReaderConsole  # type: ignore
    from pyrepl.python_reader import main as _main

    # patch the reader console to use our run function
    ReaderConsole.execute = lambda self, code: run_and_print(
        url,
        key,
        code,
        session,
        "--lisp" in sys.argv,
        proxy,
        "--timing" in sys.argv,
    )

    # run the reader
    try:
        _main()
    except EOFError:
        pass


if __name__ == "__main__":
    main()
