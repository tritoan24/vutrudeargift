import Core from "../core";
import Environment from "../environment";
import Character from "../character";
import Css3DRenderer from "../css3DRenderer";
import Audio from "../audio";
import RayCasterControls from "../rayCasterControls";
import {ON_CLICK_RAY_CAST, ON_HIDE_TOOLTIP, ON_LOAD_MODEL_FINISH, ON_LOAD_PROGRESS, ON_ENTER_APP, ON_SHOW_TOOLTIP} from "../Constants";
import {Object3D} from "three";

export default class World {
	private core: Core;
	private environment: Environment;
	private character: Character;
	private css_3d_renderer: Css3DRenderer;
	private audio: Audio | null = null;
	private ray_caster_controls: RayCasterControls;

	constructor() {
		this.core = new Core();

		this.core.$on(ON_LOAD_PROGRESS, this._handleLoadProgress.bind(this));
		this.core.$on(ON_LOAD_MODEL_FINISH, this._onLoadModelFinish.bind(this));
		this.core.$on(ON_CLICK_RAY_CAST, this._onClickRayCast.bind(this));
		this.core.$on(ON_SHOW_TOOLTIP, this._onShowTooltip.bind(this));
		this.core.$on(ON_HIDE_TOOLTIP, this._onHideTooltip.bind(this));
		this.core.$on(ON_ENTER_APP, this._onEnterApp.bind(this));

		this.environment = new Environment();
		this.character = new Character({speed: 12});
		this.css_3d_renderer = new Css3DRenderer();
		this.ray_caster_controls = new RayCasterControls();
		// KHÔNG tạo Audio ở đây!
	}

	update(delta: number) {
		if (this.environment.collider && this.environment.is_load_finished) {
			this.css_3d_renderer.update();
			this.character.update(delta, this.environment.collider);
			this.ray_caster_controls.updateTooltipRayCast(this.environment.raycast_objects);
		}
	}

	/*
	* Callback khi click vào để vào triển lãm
	* */
	private _onEnterApp() {
		this.audio?.playAudio();
		//Callback khi click vào để vào triển lãm
		this.core.control_manage.enabled();
	}

	private async _onLoadModelFinish() {
		// Tạo Audio sau khi Environment đã load xong và có audioUrl
		this.audio = new Audio(this.environment.audioUrl);
		await this.audio.createAudio();

		// Sau khi âm thanh tải xong thì xóa UI tiến trình tải, hiển thị UI xác nhận vào
		this.core.ui.removeLoading();
		this.core.ui.showLoadingConfirm();

		// Sau khi âm thanh tải xong thì xóa UI tiến trình tải, hiển thị UI xác nhận vào rayCasterControls
		this.ray_caster_controls.bindClickRayCastObj(this.environment.raycast_objects);
	}

	private _handleLoadProgress([{url, loaded, total}]: [{url: string, loaded: number, total: number}]) {
		const percentage = ((loaded / total) * 100).toFixed(2);
		if (/.*\.(blob|glb)$/i.test(url)) {
			this.core.ui.updateLoadingProgress(`${url.includes("collision") ? "Đang tải mô hình va chạm" : "Đang tải mô hình cảnh khác"}：${percentage}%`);
		}
		if (/.*\.(jpg|png|jpeg)$/i.test(url)) {
			this.core.ui.updateLoadingProgress("đang tải tài nguyên ảnh...");
		}
		if (/.*\.(m4a|mp3)$/i.test(url)) {
			this.core.ui.updateLoadingProgress("đang tải tài nguyên âm thanh...");
		}
	}

	private _onClickRayCast([object]: [object: Object3D]) {
		if (object.userData.type === "question") {
			this.core.ui.showQuestionBox(
				object.userData.question,
				object.userData.options,
				object.userData.src
			);
		} else {
			this.core.ui.showBoardsBox(
				object.userData.title,
				object.userData.author,
				object.userData.describe,
				object.userData.src
			);
		}
	}

	private _onShowTooltip([{msg, show_preview_tips}]: [{ msg: string, show_preview_tips: boolean }]) {
		this.core.ui.showPreviewTooltip(msg, show_preview_tips);
	}

	private _onHideTooltip() {
		this.core.ui.hidePreviewTooltip();
	}
}