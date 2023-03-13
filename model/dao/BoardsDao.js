//const pool=require("../db/WebAppBoardPool");
class BoardsDao{
    #findBySearchSql="SELECT * FROM boards";
    #countBySearchSql="SELECT COUNT(*) FROM boards";

    #findByIdSql="SELECT * FROM boards WHERE b_id=?";
    #findByUidSql= "SELECT * FROM boards WHERE u_id=?";

    #updateSql= "UPDATE boards SET title=?, content=?, status=? WHERE b_id=?";
    #insertSql= "INSERT INTO boards (u_id,title,content ,status) value (?,?,?,?)";
    #deleteSql= "DELETE FROM boards WHERE b_id=?";
    #pool;
    #checkBoard={
        b_id:true,
        u_id:true,
        post_time:true,
        update_time:true,
        status:true,
        tile:true,
        content:true,
        view_count:true,
        DESC:true,
        ASC:true
    }
    //ORDER BY (title) (0)
    //ORDER BY (title;DROP DATABLE webAppBoard;) (X)
    //검색이나 정렬시 필드를 바로 쿼리에 대입하는데 sql injection 을 당할 수 있어서 검사함
    constructor(pool) {
        this.#pool=pool;
    }
    async findBySearch(pageVo){
        //검색이 있다면 pageVo.searchField  pageVo.searchValue 이 null 이 아님
        let searchQuery=this.#findBySearchSql;//"SELECT * FROM boards"
        if(pageVo.searchField && pageVo.searchValue && this.#checkBoard[pageVo.searchField]){
            searchQuery+=` WHERE ${pageVo.searchField} LIKE '%${pageVo.searchValue}%'`
        }
        searchQuery+=" ORDER BY "+((this.#checkBoard[pageVo.orderField] && pageVo.orderField )|| "post_time");
        searchQuery+=" "+((this.#checkBoard[pageVo.orderDirect] && pageVo.orderDirect ) || "DESC");
        searchQuery+=" LIMIT ?,?";
        const [rows,f]=await this.#pool.query(searchQuery,[pageVo.offset,pageVo.rowLength])
        return rows;
    }
    async countBySearch(searchField, searchValue){
        let sql=this.#countBySearchSql;
        if(searchField && searchValue){
            sql+=` WHERE ${searchField} LIKE '%${searchValue}%'`;
        }
        const [rows, f]=await this.#pool.query(sql);
        return rows[0]["COUNT(*)"];
    }

    async  findById (bId){
        const [rows,f]=await this.#pool.query(this.#findByIdSql,[bId]);
        return rows[0] || null;
    };

    async findByUid (uId){
        const [rows,f]=await this.#pool.query(this.#findByUidSql,[uId]);
        return rows[0] || null;
    };

    async updateById (board) {
        let update=0;
        const values=[
            board.title,
            board.content,
            board.status,
            board.b_id

        ];
        try{
            const [result]=await this.#pool.execute(this.#updateSql, values);
            update=result.affectedRows;
        }catch (e) {
            throw new Error(e);
        }
        return update;
    };

    async insertOne (board) {
        let insert=0;
        const values=[
            board.u_id,
            board.title,
            board.content,
            board.status
        ];
        try{
            const [result]=await this.#pool.execute(this.#insertSql,values);
            insert=result.affectedRows;
        }catch (e) {
            throw new Error(e);
        }
        return insert;
    };
     async deleteOne (bId){
        let del=0;
        try{
            const [result, f]=await this.#pool.execute(this.#deleteSql,[bId]);
            del=result.affectedRows;
        }catch(e){
            throw new Error(e);
        }
        return del;
    }
}
module.exports=BoardsDao;