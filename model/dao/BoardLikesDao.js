class BoardLikesDao{
    //BoardService 호출해서 detail 구현하세요!
    #groupByStatusFindByBidSql="SELECT COUNT(*),status FROM board_likes WHERE b_id=? GROUP BY status";
    async groupByStatusFindByBid(bId){

    }
}

//모델(서비스) : 유저가 실제 받는 서비스 (db)