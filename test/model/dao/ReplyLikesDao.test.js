const pool=require("../../../model/db/WebAppBoardPool");
const ReplyLikesDao=require("../../../model/dao/ReplyLikesDao");
const replyLikesDao=new ReplyLikesDao(pool);

describe("ReplyLikesDao test",()=>{
   test("countStatusByBrId",async ()=>{
      const bls=await replyLikesDao.countStatusByBrId(16);
      console.log(bls);
      expect(Array.isArray(bls)).toBeTruthy();
   });
});