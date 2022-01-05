const gameboard = (() =>{
    let turnOrder = true;
    let winCombinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    let board = document.querySelectorAll('.gameBoard_tile');
    let roundResult;
    let autoPlay = true;
    
    
    const getTile = ()=>{
        board.forEach(tile =>{
            tile.addEventListener('click', ()=>{
                autoPlay = changeOpponent();
                if(roundResult == true) return;
                tileAppend(tile);
                changeTurn();
                roundResult = roundEnd(tile.textContent);
                roundFinish(tile.textContent)
                
                if(autoPlay == true && !roundResult){
                setDifficulty();
                changeTurn();
                roundResult = roundEnd('o');
                roundFinish('o')
                }
            })
        })
    }


    const changeDifficulty=()=>{
        let difficulties = ['Easy','Medium','Impossible']
        let index = 0;
        let button=document.querySelector('#difficulty')
        button.addEventListener('click',()=>{
            index++;
            if(index>2){index = 0}
           button.textContent = difficulties[index];
           reset();
        })
    }
    changeDifficulty();

    const changeOpponent = ()=>{
        const span =document.querySelector('#currentPlayer');
        if(span.textContent === 'Player 2'){
            autoPlay = false;
        }else if(span.textContent === 'CPU'){
            autoPlay = true;
        }
        return autoPlay;
    }

    const setDifficulty = ()=>{
        let difficulty = document.querySelector('#difficulty').textContent;
        let randomDiff = Math.floor(Math.random()*100)
        if(difficulty === 'Easy'){
            return cpuPlayer.autoPlay();
        }else if(difficulty === 'Medium'){
            if(randomDiff < 64){
                return cpuPlayer.bestMove();
            }else {
                return cpuPlayer.autoPlay();
            }
        }else if(difficulty === 'Impossible'){
            return cpuPlayer.bestMove();
        }
    }

    const tileAppend = (tile)=>{
        if(tile.textContent !==  '') return
            if ( turnOrder){
                tile.textContent = 'x';
            }else if( !turnOrder){
                tile.textContent =  'o';
            }
    }
    
    const changeTurn = ()=>{
        turnOrder = !turnOrder;
    }

    const roundFinish = (tileText)=>{
        if(roundResult === true){
            score(tileText);
        }else if(roundResult === false){
            checkTie();
        }
    }

    const roundEnd =  (tile)=>{
      return  winCombinations.some(combination =>{
           return combination.every(index =>{
                return board[index].textContent == tile
            })
        });
    }

    
    const checkTie = ()=>{
        let moves = 0;
        for(let i = 0; i<board.length;i++){
            if(board[i].textContent != ''){
                moves++
            }
        }
        if(moves == 9){return 'tie'}else{return null}
    }

    const reset = ()=>{
        const tileNodes = Array.from(document.querySelectorAll('.gameBoard_tile'));
        for(let i=0;i<tileNodes.length;i++){
            tileNodes[i].textContent = '';
        }
         roundResult = false;   
         turnOrder = true;  
    }

    const score = (winner)=>{
        if(roundResult == true && winner === 'x'){
            playerOne.appendScore();
        }else if (roundResult == true && winner === 'o' && autoPlay == false){
            playerTwo.appendScore();
        }else if(roundResult == true && winner === 'o' && autoPlay == true){
            cpu.appendScore();
        }
        else{return;}
    }

    return {
        getTile,
        reset,
        roundEnd,
        roundFinish,
        checkTie,
        changeOpponent,
        }
})();

const players = (playerDiv) =>{
    let playerScore = 0;
    
    const appendScore = ()=>{
        playerScore++;
        let playerScoreString = document.querySelector(playerDiv);
        playerScoreString.textContent = playerScoreString.textContent.slice(0,-1) +' '+ playerScore;
        
    }

    
    
    return{
        playerScore,
        appendScore
    }
}


const cpuPlayer = (()=>{
    const board = document.querySelectorAll('.gameBoard_tile');
    const autoPlay = ()=>{
        let index = Math.floor(Math.random()*9);
        if(board[index].textContent === ''){
            board[index].textContent = 'o';
        }else {
            if(gameboard.checkTie() == 'tie') return;
            autoPlay();
        }
    }
     
    const bestMove = () =>{
        let bestScore = -Infinity;
        let move;
        for(let i=0;i<board.length;i++){
            if(board[i].textContent == ''){
                board[i].textContent = 'o'
                let score = minimax(board,0,false);
                board[i].textContent = '';
                if(score>bestScore){
                    bestScore = score;
                    move = i;
                }
            }
        }
        if(gameboard.checkTie() == 'tie') return;
        board[move].textContent = 'o';
    }

        
        

    const minimax= (board,depth,isMax)=>{
   
        if(gameboard.roundEnd('x')== true){
            return -10;
        }else if(gameboard.roundEnd('o')==true){
            return 10;
        }else if(gameboard.checkTie() == 'tie'){
            return 0;
        }


        if(isMax){
            let bestScore = -Infinity;
            for(let i=0;i<board.length;i++){
                if(board[i].textContent == ''){
                    board[i].textContent = 'o';
                    let score = minimax(board,depth+1,false);
                    board[i].textContent = '';
                    bestScore = Math.max(score,bestScore);
                }
            }
            return bestScore;
        }else{
            let bestScore = Infinity;
            for(let i=0;i<board.length;i++){
                if(board[i].textContent == ''){
                    board[i].textContent = 'x';
                    let score = minimax(board,depth+1,true);
                    board[i].textContent = '';
                    bestScore = Math.min(score,bestScore);
                }
            } 
            return bestScore;    
        }
    }

    return{autoPlay,
    bestMove}
})();

const menuHandler = (()=>{
    const showMenu =()=>{
        document.querySelector('.gameboard_menu-container').classList.add('show')
        if(document.querySelector('#currentPlayer').textContent == 'CPU'){
            document.querySelector('.gameboard_menu-cpuImage').classList.add('show')
        }else{
            document.querySelector('.gameboard_menu-playerTwoImage').classList.add('show')
        }

        gameboard.reset()
   }

    const closeMenu=()=>{
        document.querySelector('.gameboard_menu-container').classList.remove('show')
        document.querySelector('.gameboard_menu-cpuImage').classList.remove('show')
        document.querySelector('.gameboard_menu-playerTwoImage').classList.remove('show')
    }

    const divClick=()=>{
        document.querySelector('.gameboard_menu-container').addEventListener('click',(e)=>{
            if(e.target !== e.currentTarget) return
            document.querySelector('.gameboard_menu-container').classList.remove('show')
            document.querySelector('.gameboard_menu-cpuImage').classList.remove('show')
            document.querySelector('.gameboard_menu-playerTwoImage').classList.remove('show')
        })
    }
    const changePlayer=()=>{
        let player = document.querySelector('.gameboard_menu-playerTwoImage');
        let cpu = document.querySelector('.gameboard_menu-cpuImage');
        if(cpu.classList.contains('show')){
            cpu.classList.remove('show')
            player.classList.add('show')
            document.querySelector('.CPU').classList.remove('show')
            document.querySelector('.player2').classList.add('show')
            document.querySelector('#currentPlayer').textContent = 'Player 2'
        }else if (player.classList.contains('show')){
            player.classList.remove('show')
            cpu.classList.add('show')
            document.querySelector('.player2').classList.remove('show')
            document.querySelector('.CPU').classList.add('show')
            document.querySelector('#currentPlayer').textContent = 'CPU'

        }
    }
    divClick();

    return{
        showMenu,
        closeMenu,
        divClick,
        changePlayer
    }
})();

gameboard.getTile();
const playerOne = players('.player1');
const playerTwo = players('.player2');
const cpu = players('.CPU')
