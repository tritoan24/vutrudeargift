import {Box3, Line3, Matrix4, Mesh, MeshBasicMaterial, Vector3} from "three";
import {RoundedBoxGeometry} from "three/examples/jsm/geometries/RoundedBoxGeometry";
import Core from "../core";
import {ON_KEY_DOWN} from "../Constants";

type CharacterParams = {
	reset_position?: Vector3,
	reset_y?: number,
	speed?: number,
	jump_height?: number,
	gravity?: number
}

export default class Character {
	private core: Core;
	private character!: Mesh<RoundedBoxGeometry, MeshBasicMaterial>;
	private capsule_info = { 
		radius: 1,
		segment: new Line3(
			new Vector3(),
			new Vector3(0, -5, 0.0)
		)
	};

	private reset_position: Vector3; 
	private reset_y: number;
	private gravity: number; 
	private jump_height: number; 
	private speed: number;
	private player_is_on_ground = false; 
	private velocity = new Vector3();

	private up_vector = new Vector3(0, 1, 0);
	private temp_vector = new Vector3();
	private temp_vector2 = new Vector3();
	private temp_box = new Box3();
	private temp_mat = new Matrix4();
	private temp_segment = new Line3();

	constructor({
        reset_position = new Vector3(0, 5, 0),
        reset_y = -25,
        speed = 6,
        jump_height = 20,
        gravity = -50
    }: CharacterParams) {
		this.core = new Core();

		this.reset_position = reset_position;
		this.reset_y = reset_y;
		this.gravity = gravity;
		this.jump_height = jump_height;
		this.speed = speed;

		this._createCharacter();

		this.core.$on(ON_KEY_DOWN, this._onKeyDown.bind(this));
	}

	update(delta_time: number, collider: Mesh) {
		this._updateOrbitControls();

		this._updateCharacter(delta_time);

		this._checkCollision(delta_time, collider);

		this.core.camera.position.sub(this.core.orbit_controls.target);
		this.core.orbit_controls.target.copy(this.character.position);
		this.core.camera.position.add(this.character.position);

		this._checkReset();
	}

	private _createCharacter() {
		this.character = new Mesh(
			new RoundedBoxGeometry(0.5, 2.5, 0.5, 10, 1),
			new MeshBasicMaterial({color: 0x0000ff})
		);
		this.character.geometry.translate(0, -0.25, 0);
		this.character.position.copy(this.reset_position);
		this.character.visible = false;
		this.core.scene.add(this.character);
	}

	private _checkCollision(delta_time: number, collider: Mesh) {
		// Điều chỉnh vị trí người chơi dựa trên va chạm
		const capsule_info = this.capsule_info;
		this.temp_box.makeEmpty();
		this.temp_mat.copy(collider.matrixWorld).invert();
		this.temp_segment.copy(capsule_info.segment);

		// Lấy vị trí của hình trụ trong không gian cục bộ của va chạm
		this.temp_segment.start.applyMatrix4(this.character.matrixWorld).applyMatrix4(this.temp_mat);
		this.temp_segment.end.applyMatrix4(this.character.matrixWorld).applyMatrix4(this.temp_mat);

		// Lấy hộp giới hạn căn chỉnh trục của hình trụ
		this.temp_box.expandByPoint(this.temp_segment.start);
		this.temp_box.expandByPoint(this.temp_segment.end);

		this.temp_box.min.addScalar(-capsule_info.radius);
		this.temp_box.max.addScalar(capsule_info.radius);

		collider.geometry?.boundsTree?.shapecast({
			intersectsBounds: box => box.intersectsBox(this.temp_box),
			intersectsTriangle: tri => {
				// Kiểm tra xem cảnh có giao với hình trụ không và điều chỉnh
				const tri_point = this.temp_vector;
				const capsule_point = this.temp_vector2;

				const distance = tri.closestPointToSegment(this.temp_segment, tri_point, capsule_point);
				if (distance < capsule_info.radius) {
					const depth = capsule_info.radius - distance;
					const direction = capsule_point.sub(tri_point).normalize();

					this.temp_segment.start.addScaledVector(direction, depth);
					this.temp_segment.end.addScaledVector(direction, depth);
				}
			}
		});

		// Sau khi kiểm tra, lấy vị trí điều chỉnh của bộ va chạm hình trụ
		// Va chạm cảnh và di chuyển nó. capsule_info.segment.start được giả định là điểm gốc của mô hình người chơi.
		const new_position = this.temp_vector;
		new_position.copy(this.temp_segment.start).applyMatrix4(collider.matrixWorld);

		// Kiểm tra bộ va chạm đã di chuyển bao nhiêu
		const delta_vector = this.temp_vector2;
		delta_vector.subVectors(new_position, this.character.position);

		this.player_is_on_ground = delta_vector.y > Math.abs(delta_time * this.velocity.y * 0.25);

		const offset = Math.max(0.0, delta_vector.length() - 1e-5);
		delta_vector.normalize().multiplyScalar(offset);

		// Điều chỉnh vị trí mô hình người chơi
		this.character.position.add(delta_vector);

		if (!this.player_is_on_ground) {
			delta_vector.normalize();
			this.velocity.addScaledVector(delta_vector, -delta_vector.dot(this.velocity));
		} else {
			this.velocity.set(0, 0, 0);
		}
	}

	/*
	* Kiểm tra rơi khỏi bản đồ
	* */
	private _checkReset() {
		if (this.character.position.y < this.reset_y) {
			this._reset();
		}
	}

	private _reset() {
		this.velocity.set(0, 0, 0);
		this.character.position.copy(this.reset_position);
		this.core.camera.position.sub(this.core.orbit_controls.target);
		this.core.orbit_controls.target.copy(this.character.position);
		this.core.camera.position.add(this.character.position);
		this.core.orbit_controls.update();
	}

	private _updateCharacter(delta_time: number) {
		this.velocity.y += this.player_is_on_ground ? 0 : delta_time * this.gravity;
		this.character.position.addScaledVector(this.velocity, delta_time);
		const angle = this.core.orbit_controls.getAzimuthalAngle();

		if (this.core.control_manage.mode === "pc") { // Di chuyển vị trí nhân vật dựa trên thao tác PC
			if (this.core.control_manage.key_status["KeyW"]) {
				this.temp_vector.set(0, 0, -1).applyAxisAngle(this.up_vector, angle);
				this.character.position.addScaledVector(this.temp_vector, this.speed * delta_time);
			}

			if (this.core.control_manage.key_status["KeyS"]) {
				this.temp_vector.set(0, 0, 1).applyAxisAngle(this.up_vector, angle);
				this.character.position.addScaledVector(this.temp_vector, this.speed * delta_time);
			}

			if (this.core.control_manage.key_status["KeyA"]) {
				this.temp_vector.set(-1, 0, 0).applyAxisAngle(this.up_vector, angle);
				this.character.position.addScaledVector(this.temp_vector, this.speed * delta_time);
			}

			if (this.core.control_manage.key_status["KeyD"]) {
				this.temp_vector.set(1, 0, 0).applyAxisAngle(this.up_vector, angle);
				this.character.position.addScaledVector(this.temp_vector, this.speed * delta_time);
			}
		} else { // Di chuyển vị trí nhân vật dựa trên thao tác thiết bị di động
			const degree = this.core.control_manage.move_degree;
			if (degree) {
				const angle = (degree - 90) * (Math.PI / 180);
				this.temp_vector.set(0, 0, -1).applyAxisAngle(this.up_vector, angle);
				this.temp_vector.applyQuaternion(this.core.camera.quaternion);
				this.character.position.addScaledVector(this.temp_vector, this.speed * delta_time);
			}
		}


		this.character.updateMatrixWorld();
	}

	private _updateOrbitControls() {
		this.core.orbit_controls.maxPolarAngle = Math.PI;
		this.core.orbit_controls.minDistance = 1e-4;
		this.core.orbit_controls.maxDistance = 1e-4;
	}

	private _onKeyDown([key_code]: [keycode: string]) {
		if (key_code === "Space") {
			this._onCharacterJump();
		}
	}

	private _onCharacterJump() {
		if (this.player_is_on_ground) {
			this.velocity.y = this.jump_height;
		}
	}
}
