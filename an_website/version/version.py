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

"""The version page of the website."""

from __future__ import annotations

from ctypes import c_char
from multiprocessing import Array
from pathlib import Path
from typing import cast

from blake3 import blake3  # type: ignore[import]

from .. import DIR as ROOT_DIR
from .. import VERSION
from ..utils.request_handler import APIRequestHandler, HTMLRequestHandler
from ..utils.utils import ModuleInfo

FILE_HASHES = Array(c_char, 1024**2)
HASH_OF_FILE_HASHES = Array(c_char, 40)


def get_module_info() -> ModuleInfo:
    """Create and return the ModuleInfo for this module."""
    return ModuleInfo(
        handlers=(
            (r"/version(/full|)", Version),
            (r"/api/version", VersionAPI),
        ),
        name="Versions-Informationen",
        short_name="Versions-Info",
        description="Die aktuelle Version der Webseite",
        path="/version",
        keywords=("Version", "aktuell"),
    )


def hash_bytes(data: bytes) -> str:
    """Hash data with fast BLAKE3BRAILLE20."""
    return "".join(chr(spam + 0x2800) for spam in blake3(data).digest(20))


def hash_all_files() -> str:
    """Hash all files."""
    return "\n".join(
        f"{hash_bytes(path.read_bytes())} {path.relative_to(ROOT_DIR)}"
        for path in sorted(Path(ROOT_DIR).rglob("*"))
        if path.is_file() and "__pycache__" not in path.parts
    )


def get_file_hashes() -> str:
    """Return the file hashes."""
    with FILE_HASHES:
        if FILE_HASHES.value:
            return cast(str, FILE_HASHES.value.decode("utf-8"))
        file_hashes = hash_all_files()
        FILE_HASHES.value = file_hashes.encode("utf-8")
        return file_hashes


def get_hash_of_file_hashes() -> str:
    """Return a hash of the file hashes."""
    with HASH_OF_FILE_HASHES:
        if HASH_OF_FILE_HASHES.value:
            return cast(str, HASH_OF_FILE_HASHES.value.decode("utf-16-be"))
        hash_of_file_hashes = hash_bytes(get_file_hashes().encode("utf-8"))
        HASH_OF_FILE_HASHES.value = hash_of_file_hashes.encode("utf-16-be")
        return hash_of_file_hashes


class VersionAPI(APIRequestHandler):
    """The Tornado request handler for the version API."""

    async def get(self, *, head: bool = False) -> None:
        """Handle the GET request to the version API."""
        if head:
            return
        await self.finish_dict(version=VERSION, hash=get_hash_of_file_hashes())


class Version(HTMLRequestHandler):
    """The Tornado request handler for the version page."""

    async def get(self, full: str, *, head: bool = False) -> None:
        """Handle the GET request to the version page."""
        if head:
            return
        await self.render(
            "pages/version.html",
            version=VERSION,
            file_hashes=get_file_hashes(),
            hash_of_file_hashes=get_hash_of_file_hashes(),
            full=full,
        )
