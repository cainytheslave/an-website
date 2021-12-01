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

"""
A page with a JavaScript web label page.

This is used for LibreJS to make sure the extension knows the licenses.
This isn't important, as the JS files should contain the licenses themselves.
This assumes that every file is licensed under AGPL v3.

See: https://www.gnu.org/software/librejs/free-your-javascript.html#step3
and https://www.gnu.org/licenses/javascript-labels.html
"""
from __future__ import annotations

import logging
import os.path
from functools import cache

from ..utils.request_handler import BaseRequestHandler
from ..utils.utils import STATIC_DIR, ModuleInfo

logger = logging.getLogger(__name__)


def get_module_info() -> ModuleInfo:
    """Create and return the ModuleInfo for this module."""
    return ModuleInfo(
        handlers=((r"/js-lizenzen/", JSLicenses),),
        name="JavaScript-Lizenzen",
        description="Informationen über die Lizenzen der JavaScript-Dateien "
        "auf dieser Seite",
        path="/js-lizenzen/",
        aliases=("/js-licenses/",),
        keywords=("JavaScript", "License", "Lizenz"),
    )


@cache
def get_js_file_names():
    """Get the names of the JS files in this project."""
    js_files_dir = os.path.join(STATIC_DIR, "js")
    return os.listdir(js_files_dir)


class JSLicenses(BaseRequestHandler):
    """The request handler for the JS-licenses page."""

    RATELIMIT_TOKENS = 0

    async def get(self):
        """Handle the GET requests to the JS-licenses page."""
        await self.render(
            "pages/js_licenses.html", js_files=get_js_file_names()
        )
