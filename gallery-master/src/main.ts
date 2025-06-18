import Core from "./core";
import { fetchRoomBoards } from './Constants';

const core = new Core();
core.render();

async function main() {
  const { boards, audioUrl, roomColorHex } = await fetchRoomBoards();

  // Đợi DOM đã render dialog board (có thể cần setTimeout nếu dialog render sau)
  setTimeout(() => {
    const boardsInfo = document.querySelector('.boards-container') as HTMLElement;
    const questionblock  = document.querySelector('.question-container') as HTMLElement;
    if (boardsInfo) {
      boardsInfo.style.background = roomColorHex === "0xff69b4" ? "#FF69B4" : "#000";
      questionblock.style.background = roomColorHex === "0xff69b4" ? "#FF69B4" : "#000";
    }
  }, 0);

  // ...phần khởi tạo giao diện khác...
}

main();
