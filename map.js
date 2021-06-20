let chunks = [];
local = JSON.parse(localStorage.getItem("local"));

initMap();

button = document.getElementById('add-chunk');
button.onclick = function() {
    var candidates = document.getElementsByClassName("possible");
    console.log(candidates);
    var newChunk = candidates[Math.floor(Math.random()*candidates.length)];
    console.log(newChunk);
    updateChunk(newChunk, 'active');
    var x = (newChunk.style.left.split('px')[0]-25)/192;
    var y = (newChunk.style.top.split('px')[0]-25)/192;
    try {
        if (chunks[x-1][y].classList.contains('unused')) {
            updateChunk(chunks[x-1][y], 'possible')
        }
    } catch(e){}
    try {
        if (chunks[x+1][y].classList.contains('unused')) {
            updateChunk(chunks[x+1][y], 'possible')
        }
    } catch(e){}
    try {
        if (chunks[x][y-1].classList.contains('unused')) {
            updateChunk(chunks[x][y-1], 'possible')
        }
    } catch(e){}
    try {
        if (chunks[x][y+1].classList.contains('unused')) {;
            updateChunk(chunks[x][y+1], 'possible')
        }
    } catch(e){}
    localStorage.setItem("local", JSON.stringify(chunks));
};

button = document.getElementById('reset-map');
button.onclick = function() {
    localStorage.removeItem("local");
    for (i in chunks) {
        for (j in chunks[i]) {
            updateChunk(chunks[i][j], 'unused');
        }
    }
};

function initMap() {
    for (i = 0; i < 43; i++) {
        if (chunks.length <= i) {
            chunks.push([]);
        }
        for (j = 0; j < 25; j++) {
            chunks[i].push(document.createElement('a'));
            document.body.appendChild(chunks[i][j]);
            chunks[i][j].classList.add("chunk");
            try {
                updateChunk(chunks[i][j], local[i][j].status);
            } catch(e){
                updateChunk(chunks[i][j], 'unused');
            }

            chunks[i][j].classList.add("unused");
            chunks[i][j].setAttribute('style', 'top:'+(25+(j*192))+"px; left:"+(25+(i*192))+"px");
            chunks[i][j].onclick = function() {
                if (this.classList.contains('unused')) {
                    updateChunk(this, 'possible')
                } else if (this.classList.contains('possible')) {
                    updateChunk(this, 'active')
                } else if (this.classList.contains('active')) {
                    updateChunk(this, 'unused')
                }
                localStorage.setItem("local", JSON.stringify(chunks));
            }
        }
    }
}

function updateChunk(chunk, status) {
    if (status!=='unused') { chunk.classList.remove('unused'); }
    if (status!=='possible') { chunk.classList.remove('possible'); }
    if (status!=='active') { chunk.classList.remove('active'); }
    chunk.classList.add(status);
    chunk.status=status;
}