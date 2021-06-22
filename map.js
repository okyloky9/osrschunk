let chunks = [];

let impChunks = [];

let begChunks = [];
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
                if(this.classList.contains('unused')){
                    updateChunk(this, 'impossible')
                }else if(this.classList.contains('impossible')){
                    updateChunk(this, 'unused')
                }
                localStorage.setItem("local", JSON.stringify(chunks));
                //open up a menu related to that specific chunk with clue related data
            }
        }
    }
    
    initImpossible();
    
}

function initImpossible(){
    impChunks.push([31,13]); 
    
    for(i=0; i < impChunks.length; i++){
        updateChunk(chunks[impChunks[i][1]][impChunks[i][2]], 'impossible');
    }
    
    localStorage.setItem("local", JSON.stringify(chunks));
}

function updateChunk(chunk, status) {
    if (status!=='unused') { chunk.classList.remove('unused'); }
    if (status!=='impossible') { chunk.classList.remove('impossible'); }
    chunk.classList.add(status);
    chunk.status=status;
}
