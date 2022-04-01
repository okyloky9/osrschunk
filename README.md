# OSRS Chunk Map

This is a tool for viewing what clues are available within each map chunk of Old School RuneScape.

![The map of Gielinor showing what clue steps are available in each chunk](./screenshots/Map-1.png)

![Sidebar showing settings](./screenshots/Map-2.png)

![Chunk locking/unlocking mode](./screenshots/Map-3.png)

![Clue data for a chunk](/screenshots/Modal-1.png)

![Searching clue steps and STASH units](/screenshots/Search-1.png)

If you see a mistake or would like to request a feature, please [let us know](https://github.com/ConnorDY/clue-chunk-map/issues/new).

## Features

- Click and move your mouse to pan.
- Use your mouse's scroll wheel to zoom in and out.
- Click on a chunk to show the clue data for that chunk.
- Click on the search icon in the top right to open the search modal.
  - You can search for clue steps by their clue text or by what items are required.
  - You can search for STASH units by what items can be stored in them.
- Turn on "Chunk locking/unlocking mode" then click a chunk to toggle whether it is locked or unlocked.
  - Use the "Lock/unlock all chunks" button to toggle the state of all chunks.
  - Unlocked chunks will be saved locally.
  - Press "Create shareable link" to create a link that you can share with others. Opening a shared link will NOT overwrite your local data UNLESS you start making changes.
- Turn on "Data editing mode" via the sidebar to make corrections or additions.
  - Edits are saved locally. If you would like to submit a correction or addition to the data, use the "Export chunk-data.json" button and upload the file attached to a [new issue](https://github.com/ConnorDY/clue-chunk-map/issues/new).
