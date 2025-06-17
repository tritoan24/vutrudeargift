import Core from "../core";
import {ON_ENTER_APP} from "../Constants";

export default class UI {
	private core: Core;

	private doms: {
		loading: HTMLElement;
		loading_complete: HTMLElement;
		preview_tooltip: HTMLElement;
		preview_tips: HTMLElement;
		boards_dialog: HTMLElement;
		boards_container: HTMLElement;
		boards_content: HTMLElement;
		boards_title: HTMLElement;
		boards_author: HTMLElement;
		boards_describe: HTMLElement;
		boards_img: HTMLImageElement;
		help_btn: HTMLElement;
		operating_intro: HTMLElement;
		question_block: HTMLElement;
		question_container: HTMLElement;
		question_text: HTMLElement;
		question_options: HTMLElement;
		question_result: HTMLElement;
		question_img: HTMLImageElement;
	};

	constructor() {
		this.core = new Core();

		this.doms = {
			loading: document.querySelector(".loading")!,
			loading_complete: document.querySelector(".loading-complete")!,
			preview_tooltip: document.querySelector(".preview-tooltip")!,
			preview_tips: document.querySelector(".preview-tips")!,
			boards_dialog: document.querySelector(".boards-info")!,
			boards_container: document.querySelector(".boards-info .boards-container")!,
			boards_content: document.querySelector(".boards-info .boards-container .content")!,
			boards_title: document.querySelector(".boards-container .info .title")!,
			boards_author: document.querySelector(".boards-container .info .author")!,
			boards_describe: document.querySelector(".boards-container .info .describe")!,
			boards_img: document.querySelector(".boards-container .img img")!,
			help_btn: document.querySelector(".help")!,
			operating_intro: document.querySelector(".operating-intro")!,
			question_block: document.querySelector(".question-block")!,
			question_container: document.querySelector(".question-block .question-container")!,
			question_text: document.querySelector(".question-block .question-text")!,
			question_options: document.querySelector(".question-block .options")!,
			question_result: document.querySelector(".question-block .result")!,
			question_img: document.querySelector(".question-block .image img")!
		};

		document.body.addEventListener("click", this.handleClick.bind(this));
	}

	handleClick(e: MouseEvent) {
		if (e.target instanceof HTMLElement) {
			const target = e.target;
			const MAP_EVENT = [
				{
					verify: () => target.classList.contains("start"),
					handler: this.onClickEnterApp.bind(this)
				},
				{
					verify: () => this._isBInA(["boards-info-close", "boards-info"], target.classList.value.split(" ")),
					handler: this.hideBoardsBox.bind(this)
				},
				{
					verify: () => this._isBInA(["question-close", "question-block"], target.classList.value.split(" ")),
					handler: this.hideQuestionBox.bind(this)
				},
				{
					verify: () => target.classList.contains("help"),
					handler: this.showHelp.bind(this)
				},
				{
					verify: () => this._isBInA(["operating-intro-close", "operating-intro", "operating-intro-img"], target.classList.value.split(" ")),
					handler: this.hideHelp.bind(this)
				},
				{
					verify: () => target.classList.contains("option-button"),
					handler: () => this.handleOptionClick(target as HTMLButtonElement)
				}
			];

			const event = MAP_EVENT.find(item => item.verify());
			if (event) {
				event.handler();
			}
		}
	}

	onClickEnterApp() {
		this.doms.loading_complete.classList.remove("display-none");
		this.doms.loading_complete.remove();
		this.core.$emit(ON_ENTER_APP);
	}

	showHelp() {
		this.doms.operating_intro.classList.remove("display-none");
	}

	hideHelp() {
		this.doms.operating_intro.classList.add("display-none");
	}

	showBoardsBox(title: string, author: string, describe: string, img_src: string) {
		if (this.doms.boards_dialog.style.visibility === "visible") return;
		this.doms.boards_dialog.style.visibility = "visible";
		this.doms.boards_container.classList.remove("hide");
		this.doms.boards_container.classList.add("animate-in");
		this.doms.boards_title.innerText = title;
		this.doms.boards_author.innerText = author;
		this.doms.boards_describe.innerHTML = describe;
		this.doms.boards_img.src = img_src;
		this.doms.boards_content.scrollTo({top: 0, left: 0, behavior: "smooth"});
		// Remove animation class after it completes to allow re-animation
		setTimeout(() => {
			this.doms.boards_container.classList.remove("animate-in");
		}, 500); // Match animation duration
	}

	hideBoardsBox() {
		this.doms.boards_dialog.style.visibility = "hidden";
		this.doms.boards_container.classList.add("hide");
		this.doms.boards_title.textContent = "";
		this.doms.boards_author.textContent = "";
		this.doms.boards_describe.textContent = "";
		this.doms.boards_img.src = "";
	}

	showQuestionBox(question: string, options: { text: string; isCorrect: boolean }[], img_src: string) {
		if (this.doms.question_block.style.display === "flex") return;
		this.doms.question_block.style.display = "flex";
		this.doms.question_container.classList.remove("hide");
		this.doms.question_container.classList.add("animate-in");
		this.doms.question_text.innerText = question;
		this.doms.question_img.src = img_src;
		this.doms.question_result.innerText = "";

		// Clear existing options
		this.doms.question_options.innerHTML = "";

		// Create buttons for each option
		options.forEach((option, index) => {
			const button = document.createElement("button");
			button.classList.add("option-button");
			button.innerText = option.text;
			button.dataset.isCorrect = option.isCorrect.toString();
			this.doms.question_options.appendChild(button);
		});

		// Remove animation class after it completes
		setTimeout(() => {
			this.doms.question_container.classList.remove("animate-in");
		}, 500); // Match animation duration
	}

	hideQuestionBox() {
		this.doms.question_block.style.display = "none";
		this.doms.question_container.classList.add("hide");
		this.doms.question_text.innerText = "";
		this.doms.question_options.innerHTML = "";
		this.doms.question_result.innerText = "";
		this.doms.question_img.src = "";
	}

	handleOptionClick(button: HTMLButtonElement) {
		const isCorrect = button.dataset.isCorrect === "true";
		this.doms.question_result.innerText = isCorrect ? "Correct!" : "Incorrect, please try again!";
		if (isCorrect) {
			// Disable all buttons on correct answer
			const buttons = this.doms.question_options.querySelectorAll("button");
			buttons.forEach(btn => btn.disabled = true);
			button.classList.add("correct");
		} else {
			// Add shake animation for incorrect answer
			button.classList.add("incorrect");
			setTimeout(() => {
				button.classList.remove("incorrect");
			}, 500); // Match animation duration
		}
	}

	showPreviewTooltip(msg: string, show_preview_tips = true) {
		this.doms.preview_tooltip.classList.remove("hide");
		if (show_preview_tips) {
			this.doms.preview_tips.classList.remove("hide");
		}
		if (this.doms.preview_tooltip.innerText === msg) return;
		this.doms.preview_tooltip.innerText = msg;
	}

	hidePreviewTooltip() {
		this.doms.preview_tooltip.classList.add("hide");
		this.doms.preview_tips.classList.add("hide");
	}

	updateLoadingProgress(loading_text: string) {
		const progress = this.doms.loading.querySelector(".progress");
		progress && (progress.textContent = loading_text);
	}

	removeLoading() {
		this.doms.loading.remove();
	}

	showLoadingConfirm() {
		this.doms.loading_complete.classList.remove("display-none");
	}

	private _isBInA(A: string[], B: string[]) {
		return B.some(name => A.includes(name));
	}
}