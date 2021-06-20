let chunks = [];
local = JSON.parse(localStorage.getItem("local"));

initMap();

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
