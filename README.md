I'd like to add a visually **simple** "overall progress" bar on my dashboard. By "overall progress," I specifically mean the percentage of currently published items that I've burned. Something like this:

![Content mockup](./progress-bar.png)

> Data fields:
>
> Burned `<a>` / `<b>`
> Reviewing: `<c>`
> Unseen: `<d>` (`<e>` unlocked)
>
> `<a>` = count of reviewed items currently in stage 9
> `<b>` = total number of (unhidden) published items on WaniKani
> `<c>` = total number of items in stages 1 through 8
> `<d>` = number of locked items not yet reviewed + current number of unreviewed but unlocked lessons
> `<e>` = current number of unreviewed lessons
>
> Bar graph shows `<a>` / `<b>` displayed as a percentage

Personally, I'm far less interested in knowing what _level_ I'm on than in how much kanji/vocabulary I've **learned**. To me, leveling up just unlocks more unseen items, so focusing on levels seems like focusing more on getting into college rather than graduating!

I know there are existing dashboard scripts and the like that will display everything I might ever want to know (and then some!), but I've been toying with the idea of trying to write what's hopefully a relatively simple script myself. The documentation for the API and WKOF is amazing, but I'm kinda allergic to javascript. I've no experience whatsoever with either (other than as a user).

I thought I'd get feedback here first (either of the encouragement or "here be dragons" variety!). If there is something similar I could look at for ideas (or blatant theft) please let me know.

Design thoughts:

The KISS principle applies: I just want a simple bar graph with no dialogs to edit preferences or whatever.

I'd like it to be meaningful for users at any level, though. It would be silly to show "0/8995 Burned" for the first several months with new users. I think it should show "Guru'd" items for users on the early levels instead (replacing `<a>` with the number of items in stages 5-9 instead). When there are more items in stage 9 than in 5-8, it should switch to showing Burned.
