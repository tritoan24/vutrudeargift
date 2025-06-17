import Core from "../core";
import Loader from "../loader";
import {BOARD_TEXTURES, BOARDS_INFO, COLLISION_SCENE_URL, ON_LOAD_MODEL_FINISH, ON_LOAD_PROGRESS, STATIC_SCENE_URL} from "../Constants";
import {Group, Material, Mesh, MeshBasicMaterial, Object3D, SRGBColorSpace, Texture, PlaneGeometry, DoubleSide} from "three";
import {isLight, isMesh} from "../utils/typeAssert";
import {MeshBVH, MeshBVHOptions, StaticGeometryGenerator} from "three-mesh-bvh";
import {Reflector} from "../lib/Reflector";

export default class Environment {
	private core: Core;
	private loader: Loader;
	private collision_scene: Group | undefined;
	collider: Mesh | undefined;
	private texture_boards: Record<string, Texture> = {};
	private gallery_boards: Record<string, Mesh> = {};
	raycast_objects: Object3D[] = [];
	is_load_finished = false;

	constructor() {
		this.core = new Core();
		this.loader = this.core.loader;
		this._loadScenes();
	}


	private async _loadScenes() {
		try {
			await this._loadSceneAndCollisionDetection();
			await this._loadStaticScene();
			await this._loadBoardsTexture();
			this._configureGallery();
			this._createSpecularReflection();
			this.is_load_finished = true;
			this.core.$emit(ON_LOAD_MODEL_FINISH);
		} catch (e) {
			console.log(e);
		}
	}

	private async _loadBoardsTexture(): Promise<void> {
		for (let i = 0; i < BOARD_TEXTURES.length; i++) {
    this.texture_boards[i + 1] = await this.loader.texture_loader.loadAsync(BOARD_TEXTURES[i]);
}

		for (const key in this.texture_boards) {
			const texture = this.texture_boards[key]
			texture.colorSpace = SRGBColorSpace;

			// Tính toán tỷ lệ co giãn cần thiết dựa trên tỷ lệ khung hình của kết cấu và tỷ lệ khung hình của mặt phẳng
			const texture_aspect_ratio = texture.image.width / texture.image.height;
			let scale_x = 1;
			let scale_y = 1;

			if (texture_aspect_ratio > 1) {
				scale_x = 1 / texture_aspect_ratio;
			} else {
				scale_y = texture_aspect_ratio;
			}

			texture.offset.set(0.5 - scale_x / 2, 0.5 - scale_y / 2);
			texture.repeat.set(scale_x, scale_y);
			texture.needsUpdate = true;
		}

		return Promise.resolve();
	}

	
	private _configureGallery() {
		for (const key in this.texture_boards) {
			const board = this.gallery_boards[`gallery${key}_board`];
			if (!board) continue; 
			const board_material = board.material;
			(board_material as MeshBasicMaterial).map = this.texture_boards[key];
			board.userData = {
				name: board.name,
				title: BOARDS_INFO[key].title,
				author: BOARDS_INFO[key].author,
				describe: BOARDS_INFO[key].describe,
				index: key,
				src: this.texture_boards[key].image.src,
				show_boards: true
			};

			if ([4, 5, 6, 7, 9].includes(+key)) {
				board.rotation.y = -Math.PI / 2;
			}
			if (8 === +key) {
				board.rotation.y = Math.PI;
			}

			(board_material as MeshBasicMaterial).needsUpdate = true;
		}
		
		// === TẠO BOARD LỚN ===
		// Lấy texture cuối cùng trong BOARD_TEXTURES
		const bigTexture = this.texture_boards["11"]; 
console.log(this.texture_boards["11"]);
		// Kích thước lớn (ví dụ: 12 x 7 mét)
		const bigWidth = 25;
		const bigHeight =15;

		// Tạo board lớn
		const bigBoard = new Mesh(
			new PlaneGeometry(bigWidth, bigHeight),
			new MeshBasicMaterial({ map: bigTexture, side: DoubleSide })
		);

		// Đặt vị trí board lớn (bạn có thể điều chỉnh lại cho phù hợp)
		bigBoard.position.set(0, bigHeight / 15 + 10, 50.5); // X, Y, Z
	bigBoard.rotation.y = Math.PI;// Quay mặt board vào tường phía sau

		this.core.scene.add(bigBoard);

		// Nếu muốn tương tác (click/tooltip)
		this.raycast_objects.push(bigBoard);
	}


	private _createSpecularReflection() {
		const mirror = new Reflector(new PlaneGeometry(100, 100), {
			textureWidth: window.innerWidth * window.devicePixelRatio,
			textureHeight: window.innerHeight * window.devicePixelRatio,
			color: 0xffffff,
		});
		if (mirror.material instanceof Material) {
			mirror.material.transparent = true;
		}
		mirror.rotation.x = -0.5 * Math.PI;
		this.core.scene.add(mirror);
	}

	private _loadStaticScene(): Promise<void> {
		return new Promise(resolve => {
			this.loader.gltf_loader.load(STATIC_SCENE_URL, (gltf) => {
				this.core.scene.add(gltf.scene);
				gltf.scene.traverse(item => {
					if (item.name === "computer") {
						item.userData = {
							name: item.name,
							title: "Bản nhạc này dành riêng cho bạn!",
						};
						this.raycast_objects.push(item);
					}
				});
				resolve();
			}, (event) => {
				this.core.$emit(ON_LOAD_PROGRESS, {url: STATIC_SCENE_URL, loaded: event.loaded, total: event.total});
			});
		});
	}

	/*
	* Tải cảnh có phát hiện va chạm
	* */
	private _loadSceneAndCollisionDetection(): Promise<void> {
		return new Promise(resolve => {
			this.loader.gltf_loader.load(COLLISION_SCENE_URL, (gltf) => {
				this.collision_scene = gltf.scene;

				// Đổi màu cho scene collision nhưng bỏ qua các bức tranh
				gltf.scene.traverse(item => {
					// Kiểm tra nếu không phải là gallery board
					if (isMesh(item) && !item.name.includes('gallery')) {
						if (item.material instanceof MeshBasicMaterial) {
							item.material.color.setHex(0xd6d6ea);
							item.material.needsUpdate = true;
						}
					}
				});

				this.collision_scene.updateMatrixWorld(true);

				this.collision_scene.traverse(item => {
					if (item.name === "home001" || item.name === "PointLight") {
						item.castShadow = true;
					}

					if (item.name.includes("PointLight") && isLight(item)) {
						item.intensity *= 2000;
					}

					if (item.name === "home002") {
						item.castShadow = true;
						item.receiveShadow = true;
					}

					// Trích xuất các phần tử khung ảnh
					if (/gallery.*_board/.test(item.name) && isMesh(item)) {
						this.gallery_boards[item.name] = item;
					}

					this.raycast_objects.push(item);
				});

				const static_generator = new StaticGeometryGenerator(this.collision_scene);
				static_generator.attributes = ["position"];

				const merged_geometry = static_generator.generate();
				merged_geometry.boundsTree = new MeshBVH(merged_geometry, {lazyGeneration: false} as MeshBVHOptions);

				this.collider = new Mesh(merged_geometry);
				this.core.scene.add(this.collision_scene);

				resolve();
			}, (event) => {
				this.core.$emit(ON_LOAD_PROGRESS, {url: COLLISION_SCENE_URL, loaded: event.loaded, total: event.total});
			});
		});
	}
}
