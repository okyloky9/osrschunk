let chunks = [];

let impChunks = [[31,13]];

let begChunks = [[32,13],[30,11],[30,12],[30,13],[33,12],[33,11],[33,13],[33,14],[34,11]];
let easyChunks = [];
let medChunks = [];
let hardChunks = [];
let eliteChunks = [];
let masterChunks = [];

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
            chunks[i][j].setAttribute('style', 'top:'+(41+(j*192))+"px; left:"+(40+(i*192))+"px");
            chunks[i][j].onclick = function() {
                document.getElementById("head").textContent = "[" + chunks[i][j].toString() + "]";
                localStorage.setItem("local", JSON.stringify(chunks));
            }
        }
    }
    
    initImpossible();
    initBeginner();
    
}

function initImpossible(){
    for(i=0; i < impChunks.length; i++){
        updateChunk(chunks[impChunks[i][1]][impChunks[i][2]], 'impossible');
    }
    
    localStorage.setItem("local", JSON.stringify(chunks));
}

function initBeginner(){
    for(i=0; i < begChunks.length; i++){
        chunks[begChunks[i][1]][begChunks[i][2]].classList.add("beginner")
    }
    localStorage.setItem("local", JSON.stringify(chunks));
}

function updateChunk(chunk, status) {
    //if (status!=='unused') { chunk.classList.remove('unused'); }
    //if (status!=='impossible') { chunk.classList.remove('impossible'); }
    chunk.classList.add(status);
    chunk.status=status;
}
