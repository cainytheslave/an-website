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
The quotes page of the website.

It displays funny, but wrong, quotes.
"""
from __future__ import annotations

import asyncio
import random
import sys
from functools import cache
from typing import Literal
from urllib.parse import quote

import orjson as json
from tornado.web import HTTPError

from ..utils.utils import ModuleInfo
from . import (
    WRONG_QUOTES_CACHE,
    QuoteReadyCheckRequestHandler,
    WrongQuote,
    create_wq_and_vote,
    get_random_id,
    get_wrong_quote,
    get_wrong_quotes,
    start_updating_cache_periodically,
)
from .quotes_img import QuoteAsImg


def get_module_info() -> ModuleInfo:
    """Create and return the ModuleInfo for this module."""
    return ModuleInfo(
        handlers=(
            (r"/zitate/", QuoteMainPage),
            # {1,10} is too much, but better too much than not enough
            (r"/zitate/([0-9]{1,10})-([0-9]{1,10})/", QuoteById),
            (r"/zitate/([0-9]{1,10})-([0-9]{1,10})/image.png", QuoteAsImg),
        ),
        name="Falsche Zitate",
        description="Eine Webseite mit falsch zugeordneten Zitaten",
        path="/zitate/",
        keywords=(
            "falsch",
            "zugeordnet",
            "Zitate",
            "Witzig",
            "Känguru",
        ),
    )


def vote_to_int(vote: str) -> Literal[-1, 0, 1]:
    """Parse a vote str to the corresponding int."""
    if vote == "-1":
        return -1
    if vote in ("0", "", None):
        return 0
    if vote == "1":
        return 1

    int_vote = int(vote)
    if int_vote < 0:
        return -1
    if int_vote > 0:
        return 1

    return 0


class QuoteBaseHandler(QuoteReadyCheckRequestHandler):
    """The base request handler for the quotes package."""

    @cache
    def rating_filter(self):
        """Get a rating filter."""
        rating_filter = self.get_query_argument("r", default="smart")
        if rating_filter not in ("w", "n", "unrated", "rated", "all"):
            return "smart"
        return rating_filter

    def get_next_url(self) -> str:
        """Get the url of the next quote."""
        next_q, next_a = self.get_next_id()
        url = f"/zitate/{next_q}-{next_a}/"
        if (rating_filter := self.rating_filter()) != "smart":
            return url + f"?r={rating_filter}"

        return self.fix_url(url)

    @cache
    def get_next_id(  # noqa: C901
        self, rating_filter: str = None
    ) -> tuple[int, int]:
        """Get the id of the next quote."""
        if rating_filter is None:
            rating_filter = self.rating_filter()
        if rating_filter == "smart":
            rand_int = random.randint(0, 27)
            if rand_int < 2:  # 0 - 1 → 2 → ~7.14%
                rating_filter = "n"
            elif rand_int < 9:  # 2 - 8 → 7 → 25%
                rating_filter = "unrated"
            elif rand_int < 15:  # 9 - 14 → 6 → ~21.43%
                rating_filter = "all"
            else:  # 15 - 27 → 13 → 46.43%
                rating_filter = "w"

        if rating_filter == "w":
            return random.choice(
                get_wrong_quotes(lambda _wq: _wq.rating > 0)
            ).get_id()
        if rating_filter == "n":
            return random.choice(
                get_wrong_quotes(lambda _wq: _wq.rating < 0)
            ).get_id()
        if rating_filter == "unrated":
            # get a random quote, but filter out already rated quotes
            while (ids := get_random_id()) in WRONG_QUOTES_CACHE:
                if WRONG_QUOTES_CACHE[ids].id == -1:
                    # Check for wrong quotes, that are unrated but in
                    # the cache. They don't have a real wrong_quotes_id
                    return ids
            return ids
        if rating_filter == "rated":
            return random.choice(get_wrong_quotes()).get_id()
        # if rating_filter == "all":
        #     pass
        return get_random_id()

    def on_finish(self):
        """
        Request the data for the next quote, to improve performance.

        This is done to ensure that the data is always up to date.
        """
        quote_id, author_id = self.get_next_id()
        asyncio.run_coroutine_threadsafe(
            get_wrong_quote(quote_id, author_id, use_cache=False),
            asyncio.get_event_loop(),
        )


class QuoteMainPage(QuoteBaseHandler):
    """The main quote page that should render a random quote."""

    async def get(self):
        """Handle the get request to the main quote page and render a quote."""
        quote_id, author_id = self.get_next_id(rating_filter="w")
        self.redirect(f"/zitate/{quote_id}-{author_id}")


class QuoteById(QuoteBaseHandler):
    """The page with a specified quote that then gets rendered."""

    async def get(self, quote_id: str, author_id: str):
        """Handle the get request to this page and render the quote."""
        await self.render_quote(int(quote_id), int(author_id))

    async def post(self, quote_id_str: str, author_id_str: str):
        """
        Handle the post request to this page and render the quote.

        This is used to vote the quote, without changing the url.
        """
        quote_id = int(quote_id_str)
        author_id = int(author_id_str)
        new_vote_str = self.get_argument("vote", default=None)
        if new_vote_str is None or new_vote_str == "":
            return await self.render_quote(quote_id, author_id)
        if (vote := vote_to_int(new_vote_str)) == new_vote_str:
            return await self.render_quote(quote_id, author_id)

        old_vote = self.get_old_vote(quote_id, author_id)

        self.update_saved_votes(quote_id, author_id, vote)

        contributed_by = self.get_argument("user-name", default="")
        if contributed_by is not None:
            contributed_by = contributed_by.strip()
        if contributed_by is None or len(contributed_by) < 2:
            contributed_by = f"an-website_{self.get_hashed_remote_ip()}"
        # do the voting:
        if vote > old_vote:
            wrong_quote = await create_wq_and_vote(
                1, quote_id, author_id, contributed_by
            )
            if vote - old_vote == 2:  # TODO: add better fix
                wrong_quote = await create_wq_and_vote(
                    1, quote_id, author_id, contributed_by
                )
        elif vote < old_vote:
            wrong_quote = await create_wq_and_vote(
                -1, quote_id, author_id, contributed_by
            )
            if vote - old_vote == -2:  # TODO: add better fix
                wrong_quote = await create_wq_and_vote(
                    -1, quote_id, author_id, contributed_by
                )
        else:
            raise HTTPError(500)
        await self.render_wrong_quote(wrong_quote, vote)

    def update_saved_votes(self, quote_id: int, author_id: int, vote: int):
        """Save the new vote in the cookies."""
        wq_str_id = f"{quote_id}-{author_id}"
        vote_dict = self.get_saved_vote_dict()
        if vote == 0:
            if wq_str_id in vote_dict:
                del vote_dict[wq_str_id]
        else:
            vote_dict[wq_str_id] = str(vote)
        #  save the votes in a cookie
        self.set_cookie(
            "votes",
            json.dumps(vote_dict),
            expires_days=365,
        )

    async def render_wrong_quote(self, wrong_quote: WrongQuote, vote: int):
        """Render the page with the wrong_quote and this vote."""
        return await self.render(
            "pages/quotes/quotes.html",
            wrong_quote=wrong_quote,
            next_href=self.get_next_url(),
            description=str(wrong_quote),
            rating_filter=self.rating_filter(),
            vote=vote,
            twitter_share_link="https://twitter.com/intent/tweet?text="
            + quote(
                str(wrong_quote)
                + "\n\nGeneriert mit: "
                + self.fix_url(self.request.path)
            ),
        )

    async def render_quote(self, quote_id: int, author_id: int):
        """Get and render a wrong quote based on author id and author id."""
        return await self.render_wrong_quote(
            await get_wrong_quote(quote_id, author_id),
            self.get_old_vote(quote_id, author_id),
        )

    @cache
    def get_old_vote(self, quote_id: int, author_id: int) -> Literal[-1, 0, 1]:
        """Get the vote saved in the cookie."""
        vote_dict = self.get_saved_vote_dict()

        key = f"{quote_id}-{author_id}"
        if key not in vote_dict:
            return 0

        if vote_dict[key] == "-1":
            return -1
        if vote_dict[key] == "1":
            return 1
        # zero as default if value is not correct
        return 0

    def get_saved_vote_dict(self) -> dict:
        """Get the vote saved in the cookie."""
        votes = self.get_cookie("votes", default=None)
        if votes is None:
            return {}
        return json.loads(votes)


try:  # TODO: add better fix for tests
    if "pytest" not in sys.modules:
        # don't connect to the internet when running with pytest
        asyncio.run_coroutine_threadsafe(
            start_updating_cache_periodically(), asyncio.get_event_loop()
        )
except RuntimeError:
    pass
