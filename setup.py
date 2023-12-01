#!/usr/bin/env python3

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
# pylint: disable=import-outside-toplevel

"""Nobody inspects the spammish repetition."""

from __future__ import annotations

from importlib.metadata import Distribution
from os import PathLike
from pathlib import Path
from subprocess import run
from warnings import filterwarnings

from setuptools import setup
from setuptools.build_meta import SetupRequirementsError

EXTRA_BUILD_DEPS = set()
GET_VERSION = "get_version==3.5.4"
TROVE_CLASSIFIERS = "trove-classifiers==2022.12.22"

filterwarnings("ignore", "", UserWarning, "setuptools.dist")

classifiers = [
    "Development Status :: 5 - Production/Stable",
    (
        "License :: OSI Approved :: "
        "GNU Affero General Public License v3 or later (AGPLv3+)"
    ),
    "Operating System :: OS Independent",
    "Programming Language :: Python",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3 :: Only",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
    "Programming Language :: Python :: Implementation :: CPython",
    "Typing :: Typed",
]


def get_version() -> str:
    """Get the version."""
    if path(".git").exists():
        try:
            # pylint: disable=redefined-outer-name
            from get_version import get_version

            return get_version(__file__, vcs="git")
        except ModuleNotFoundError:
            EXTRA_BUILD_DEPS.add(GET_VERSION)
    return Distribution.at(path(".")).version


def path(path: str | PathLike[str]) -> Path:
    """Return the absolute path to the file."""
    # pylint: disable=redefined-outer-name
    return Path(__file__).resolve().parent / path


if path(".git").exists():
    path("REVISION.txt").write_bytes(
        run(
            ("git", "rev-parse", "HEAD"),
            capture_output=True,
            cwd=path("."),
            timeout=True,
            check=True,
        ).stdout
    )

    try:
        import trove_classifiers as trove
    except ModuleNotFoundError:
        EXTRA_BUILD_DEPS.add(TROVE_CLASSIFIERS)
    else:
        assert all(_ in trove.classifiers for _ in classifiers)
        assert classifiers == sorted(classifiers)

setup(
    name="an-website",
    license="AGPL-3.0-or-later",
    platforms="OS Independent",
    author="Das Asoziale Netzwerk",
    author_email="contact@asozial.org",
    description="#1 Website in the Worlds",
    long_description_content_type="text/markdown",
    long_description=path("README.md").read_text("UTF-8"),
    version=get_version(),
    url="https://github.com/asozialesnetzwerk/an-website",
    classifiers=classifiers,
    packages=["an_website"],
    python_requires=">=3.10",
    install_requires=path("requirements.txt").read_text("UTF-8").split("\n"),
    extras_require={"jxl": ["jxlpy~=0.9"]},
    include_package_data=True,
    zip_safe=False,
    entry_points={
        "console_scripts": (
            "an-website = an_website.__main__:main",
            "an-backdoor-client = an_website.backdoor.client:main",
        )
    },
)

if EXTRA_BUILD_DEPS:
    raise SetupRequirementsError(EXTRA_BUILD_DEPS)
