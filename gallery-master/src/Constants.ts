/*
* Model Resources
* */
export const COLLISION_SCENE_URL = new URL("./assets/models/scene_collision.glb", import.meta.url).href;
export const STATIC_SCENE_URL = new URL("./assets/models/scene_desk_obj.glb", import.meta.url).href;

/*
* Texture Resources
* */
export const BOARD_TEXTURES = [
	"https://res.cloudinary.com/dtcyfyauk/image/upload/v1750091709/x0af91kvihtfyv4qcyis.jpg",
	"https://res.cloudinary.com/dtcyfyauk/image/upload/v1750091709/x0af91kvihtfyv4qcyis.jpg",
	"https://res.cloudinary.com/dtcyfyauk/image/upload/v1750091709/x0af91kvihtfyv4qcyis.jpg",
	"https://res.cloudinary.com/dtcyfyauk/image/upload/v1750091709/x0af91kvihtfyv4qcyis.jpg",
	"https://res.cloudinary.com/dtcyfyauk/image/upload/v1750091709/x0af91kvihtfyv4qcyis.jpg",
	"https://res.cloudinary.com/dtcyfyauk/image/upload/v1750091709/x0af91kvihtfyv4qcyis.jpg",
	"https://res.cloudinary.com/dtcyfyauk/image/upload/v1750091709/x0af91kvihtfyv4qcyis.jpg",
	"https://res.cloudinary.com/dtcyfyauk/image/upload/v1750091709/x0af91kvihtfyv4qcyis.jpg",
	"https://res.cloudinary.com/dtcyfyauk/image/upload/v1750084596/kp2mlcmsl1izmgekza6p.jpg",
	"https://res.cloudinary.com/dtcyfyauk/image/upload/v1750108775/jyzvvfj3b3se2nuyzenr.jpg"
];

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
    type: "info" | "question";
    question?: string;
    options?: { text: string; isCorrect: boolean }[];
}> = {
	1: {
		title: "《Quét Đi Nỗi Buồn》",
		author: "Thjnh",
		describe: `
		Cuộc sống không phải lúc nào cũng suôn sẻ, có những lúc ta gặp phải khó khăn, thất bại, nỗi buồn.<br>
		Nhưng đừng để những điều tiêu cực đó đè nặng tâm hồn, hãy cầm chổi quét đi tất cả.<br>
		Mỗi lần quét là một lần gạt bỏ những muộn phiền, để tâm hồn nhẹ nhàng, thanh thản hơn.<br>
		Hãy nhớ rằng sau cơn mưa trời lại sáng, sau những khó khăn sẽ là những điều tốt đẹp đang chờ đợi phía trước.
		`,
		type: "info"
	},
	2: {
		title: "《Nguyên Liệu Của Hạnh Phúc》",
		author: "Thjnh",
		describe: `
		Trong chiếc nồi kỳ diệu này, ta có thể tìm thấy đủ mọi cảm xúc tích cực của cuộc sống.<br>
		Một chút thông thái từ cây nấm, một chút tình yêu từ trái tim, một chút chấp nhận từ chiếc lông vũ.<br>
		Thêm vào đó là may mắn từ cỏ bốn lá, và cả sự yêu thương ấm áp từ chiếc túi nhỏ.<br>
		Khi tất cả hòa quyện lại với nhau, chúng tạo nên một công thức hoàn hảo cho hạnh phúc và niềm vui trong cuộc sống.
		`,
		type: "info"
	},
	3: {
		title: "《Hướng Dương - Nguồn Năng Lượng》",
		author: "Thjnh",
		describe: `
		Hoa hướng dương luôn hướng về phía mặt trời, mang trong mình nguồn năng lượng tích cực.<br>
		Từ một hạt giống nhỏ, nó vươn mình lớn lên, mang theo hi vọng, niềm vui, sự lạc quan và ấm áp.<br>
		Như cách hoa hướng dương luôn hướng về ánh sáng, chúng ta cũng vậy, hãy luôn hướng về những điều tốt đẹp trong cuộc sống.<br>
		Để rồi từ đó, ta học được cách sống tích cực, lạc quan và lan tỏa năng lượng tích cực đến những người xung quanh.
		`,
		type: "info"
	},
	4: {
		title: "《Hoa Hồng - Vẻ Đẹp Tinh Tế》",
		author: "Thjnh",
		describe: `
		Hoa hồng không chỉ đẹp bởi sắc màu rực rỡ, mà còn bởi sự tinh tế trong từng cánh hoa.<br>
		Mỗi bông hồng đều mang trong mình tình yêu thuần khiết, sự dịu dàng và vẻ đẹp hoàn mỹ.<br>
		Dù có gai nhọn, nhưng đó lại là biểu tượng của sự kiên cường, bảo vệ vẻ đẹp tinh khôi của mình.<br>
		Như cuộc sống này, dù có khó khăn nhưng vẫn luôn tồn tại những điều đẹp đẽ đáng để ta trân trọng và gìn giữ.
		`,
		type: "info"
	},
	5: {
		title: "《Ngôn Ngữ Của Hoa》",
		author: "Thjnh",
		describe: `
		Mỗi bông hoa đều mang trong mình một thông điệp, một câu chuyện riêng.<br>
		Những cánh hoa đầy màu sắc trong chiếc bình thủy tinh, như những lời yêu thương được gửi gắm.<br>
		Dù là hoa gì, mỗi loài đều có vẻ đẹp và ý nghĩa riêng của nó.<br>
		Hãy dành thời gian để lắng nghe những câu chuyện mà hoa đang muốn kể, để hiểu thêm về vẻ đẹp của cuộc sống.
		`,
		type: "info"
	},
	6: {
		title: "《Nắng Vàng Ấm Áp》",
		author: "Thjnh",
		describe: `
		Những tia nắng vàng ấm áp len lỏi qua những đám mây, như những nụ cười tươi sáng giữa ngày mới.<br>
		Mang theo năng lượng tích cực, xua tan đi những mây mù u ám trong tâm hồn.<br>
		Hãy đón nhận những tia nắng ấm áp ấy, để chúng sưởi ấm và thắp sáng tâm hồn bạn.<br>
		Bởi cuộc sống luôn cần những khoảnh khắc tươi sáng để tiếp thêm động lực cho những chặng đường phía trước.
		`,
		type: "info"
	},
	7: {
		title: "《Lời Khen Ngợi》",
		author: "Thjnh",
		describe: `
		Những bông hoa rực rỡ trong bó hoa này như những lời khen ngợi chân thành.<br>
		Dành tặng cho những nỗ lực, những cố gắng không ngừng nghỉ của bạn.<br>
		Mỗi bông hoa là một lời động viên, khích lệ tinh thần.<br>
		Hãy nhớ rằng, mỗi bước tiến của bạn đều đáng được trân trọng và tôn vinh.
		`,
		type: "info"
	},
	8: {
		title: "《Vẻ Đẹp Riêng》",
		author: "Thjnh",
		describe: `
		Mỗi bông hoa đều có một vẻ đẹp riêng, một giá trị riêng không thể so sánh.<br>
		Như mỗi con người chúng ta, đều mang trong mình những điều đặc biệt không ai giống ai.<br>
		Đừng cố gắng trở thành một ai đó khác, hãy là chính mình với những nét đẹp riêng có.<br>
		Bởi vì chính sự khác biệt ấy làm nên vẻ đẹp đa dạng của cuộc sống này.
		`,
		type: "info"
	},
	9: {
		title: "《Ôm Ấp Yêu Thương》",
		author: "Thjnh",
		describe: ``,
		type: "question",
		question: "Một cái ôm có thể mang lại điều gì?",
		options: [
			{ text: "Niềm vui và sự ấm áp", isCorrect: true },
			{ text: "Nỗi buồn và sự lạnh lùng", isCorrect: false },
			{ text: "Sự tức giận", isCorrect: false },
			{ text: "Không có tác dụng gì", isCorrect: false }
		]
	},
	10: {
		title: "《Tình Yêu Vô Điều Kiện》",
		author: "Thjnh",
		describe: `
		Dù bạn là ai, đang ở đâu, đang làm gì, hãy nhớ rằng bạn luôn được yêu thương.<br>
		Như chú thỏ nhỏ kia, luôn mang trong mình tình yêu để sẻ chia.<br>
		Tình yêu không cần điều kiện, không cần lý do.<br>
		Chỉ cần là chính mình, bạn đã xứng đáng được yêu thương trọn vẹn.
		`,
		type: "question",
		question: "Tình yêu vô điều kiện có nghĩa là gì?",
		options: [
			{ text: "Yêu mà không cần lý do hay điều kiện", isCorrect: true },
			{ text: "Yêu chỉ khi có lợi ích", isCorrect: false },
			{ text: "Yêu vì vẻ bề ngoài", isCorrect: false },
			{ text: "Yêu khi được yêu lại", isCorrect: false }
		]
	}
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