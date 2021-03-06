const BLOCKS = {
    tree : [ // tree라는 블록의 회전 별 모양을 담음.(direction으로 변화)
        [[1,0],[0,1],[1,1],[2,1]], //위를 보는 모양 , 안에는 좌표값을 배열로 담음.
        [[1,0],[0,1],[1,1],[1,2]], // 우측을 보는 모양
        [[2,1],[0,1],[1,1],[1,2]], // 아래를 보는 모양
        [[2,1],[1,2],[1,1],[1,0]], //  좌측을 보는 모양
    ],
    square : [ // tree라는 블록의 회전 별 모양을 담음.(direction으로 변화)
        [[0,0],[0,1],[1,0],[1,1]], 
        [[0,0],[0,1],[1,0],[1,1]], 
        [[0,0],[0,1],[1,0],[1,1]], 
        [[0,0],[0,1],[1,0],[1,1]], 
    ],
    bar : [ // tree라는 블록의 회전 별 모양을 담음.(direction으로 변화)
        [[1,0],[2,0],[3,0],[4,0]], 
        [[2,-1],[2,0],[2,1],[2,2]], 
        [[1,0],[2,0],[3,0],[4,0]], 
        [[2,-1],[2,0],[2,1],[2,2]], 
    ],
    zee : [ // tree라는 블록의 회전 별 모양을 담음.(direction으로 변화)
        [[0,0],[1,0],[1,1],[2,1]], //위를 보는 모양 , 안에는 좌표값을 배열로 담음.
        [[0,1],[1,0],[1,1],[0,2]], // 우측을 보는 모양
        [[0,1],[1,1],[1,2],[2,2]], // 아래를 보는 모양
        [[2,0],[2,1],[1,1],[1,2]], //  좌측을 보는 모양
    ],
    elLeft : [ // tree라는 블록의 회전 별 모양을 담음.(direction으로 변화)
        [[0,0],[0,1],[1,1],[2,1]], //위를 보는 모양 , 안에는 좌표값을 배열로 담음.
        [[1,0],[1,1],[1,2],[0,2]], // 우측을 보는 모양
        [[0,1],[1,1],[2,1],[2,2]], // 아래를 보는 모양
        [[1,0],[2,0],[1,1],[1,2]], //  좌측을 보는 모양
    ],
    elRight : [ // tree라는 블록의 회전 별 모양을 담음.(direction으로 변화)
        [[1,0],[2,0],[1,1],[1,2]], 
        [[0,0],[0,1],[1,1],[2,1]],
        [[1,0],[1,1],[1,2],[0,2]], 
        [[0,1],[1,1],[2,1],[2,2]],
    ],
}

export default BLOCKS;