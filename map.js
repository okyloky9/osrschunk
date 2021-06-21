let chunks = [];
const zoomElement = document.querySelection(".background");
let zoom = 1;
const ZOOM_SPEED = 0.1;
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
               //open up a menu related to that specific chunk with clue related data
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

document.addEventListener("wheel", function(e) {
    if(e.deltaY > 0){
        zoomElement.style.transform = `scale(${zoom += ZOOM_SPEED})`;
    }else{
        zoomElement.style.transform = `scale(${zoom -= ZOOM_SPEED})`;
    }
});
}
