/*
* Model Resources
* */
export const COLLISION_SCENE_URL = new URL("./assets/models/scene_collision.glb", import.meta.url).href;
export const STATIC_SCENE_URL = new URL("./assets/models/scene_desk_obj.glb", import.meta.url).href;

/*
* Audio Resources
* */
export const AUDIO_URL = new URL("./assets/audio/我记得.m4a", import.meta.url).href;

/*
* Intro
* */
export const BOARDS_INFO: Record<string, {
    title: string;
    author: string;
    describe: string;
    img: string; 
    type: "info" | "question";
    question?: string;
    options?: { text: string; isCorrect: boolean }[];
}> = {
    
};

/*
* Computer Iframe SRC
* */
export const IFRAME_SRC = new URL("/universe/index.html", import.meta.url).href;

/*
* Events
* */
export const ON_LOAD_PROGRESS = "on-load-progress";
export const ON_LOAD_MODEL_FINISH = "on-load-model-finish";
export const ON_CLICK_RAY_CAST = "on-click-ray-cast";
export const ON_SHOW_TOOLTIP = "on-show-tooltip";
export const ON_HIDE_TOOLTIP = "on-hide-tooltip";
export const ON_KEY_DOWN = "on-key-down";
export const ON_KEY_UP = "on-key-up";
export const ON_ENTER_APP = "on-enter-app";
export async function fetchRoomBoards(): Promise<{ boards: Record<string, any>, audioUrl: string | null, roomColorHex: string }> {
    const params = new URLSearchParams(window.location.search);
    if (params.get("demo") === "1") {
        // Lấy dữ liệu demo từ sessionStorage
        const demoData = sessionStorage.getItem('galleryDemoData');
        if (demoData) {
            const { boards, audioUrl, roomColorHex } = JSON.parse(demoData);
            // boards là array, cần chuyển thành object theo id
            const boardsObj: Record<string, any> = {};
            boards.forEach((b: any) => { boardsObj[b.id] = b; });
            return { boards: boardsObj, audioUrl, roomColorHex };
        }
        throw new Error("Không có dữ liệu demo");
    }
    const roomId = params.get("room");
    if (!roomId) throw new Error("Missing room id in URL");

    const res = await fetch(`https://dearlove-backend.onrender.com/api/boards/${roomId}`);
    if (!res.ok) throw new Error("Không tìm thấy phòng");
    const data = await res.json();
    const boards: Record<string, any> = {};
    data.boards.forEach((b: any) => {
        boards[b.id] = b;
    });
    // Lấy link nhạc từ description (nếu là link mp3 thì dùng, không thì null)
    let audioUrl: string | null = null;
    if (typeof data.description === "string" && data.description.trim().endsWith(".mp3")) {
        audioUrl = data.description.trim();
    }

    // Lấy mã màu từ title
    const roomColorHex = typeof data.title === "string" ? data.title.trim() : "";


    return { boards, audioUrl, roomColorHex };
}