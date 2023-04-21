import { TypedEvent } from './TypedEvents';
import { omap } from './omap'

export class MrkLib {
	static dragElement(
		draggingElement: HTMLElement,
		moveableElement: HTMLElement,
		kikapcsolas: boolean = false,
		gridSize: number = 1
	) {
		let megmozdultEvent = new TypedEvent();
		let posNewDistanceX = 0,
			posNewDistanceY = 0,
			posStartX = 0,
			posStartY = 0,
			elementStartX = 0,
			elementStartY = 0;
		if (kikapcsolas) {
			draggingElement.removeEventListener('mousedown', dragMouseDown);
		} else {
			draggingElement.addEventListener('mousedown', dragMouseDown);
		}

		function dragMouseDown(e: MouseEvent) {
			e = e || window.event;
			e.preventDefault();

			// get the mouse cursor position at startup:
			posStartX = e.clientX;
			posStartY = e.clientY;
			elementStartX = moveableElement.offsetLeft;
			elementStartY = moveableElement.offsetTop;
			document.addEventListener('mouseup', closeDragElement);
			// call a function whenever the cursor moves:
			document.addEventListener('mousemove', elementDrag);
		}

		function elementDrag(e: MouseEvent) {
			e = e || window.event;
			e.preventDefault();
			// calculate the new cursor position:
			posNewDistanceX = e.clientX - posStartX;
			posNewDistanceY = e.clientY - posStartY;

			moveableElement.style.top =
				Math.round((elementStartY + posNewDistanceY) / gridSize) * gridSize + 'px';
			moveableElement.style.left =
				Math.round((elementStartX + posNewDistanceX) / gridSize) * gridSize + 'px';
		}

		function closeDragElement() {
			// stop moving when mouse button is released:
			document.removeEventListener('mouseup', closeDragElement);
			document.removeEventListener('mousemove', elementDrag);
			let data = MrkLib.getElementPositionInParentDiv(moveableElement);
			if (data.x < 0) {
				moveableElement.style.left = 0 + 'px';
			}
			if (data.y < 0) {
				moveableElement.style.top = 0 + 'px';
			}

			megmozdultEvent.emit('');
		}

		return megmozdultEvent;
	}

	static resizeElement(
		element: HTMLElement,
		BORDER_SIZE: number = 4,
		resizeType: ResizeType,
		gridSize: number = 1
	) {
		let resizeEvent = new TypedEvent();
		// yx ---------------------------------------------------------------------------------------------------------------
		let posNewDistanceX = 0,
			posStartX = 0,
			elementStartX = 0;

		let mouseDownListenerHorizontal = (e: MouseEvent) => {
			if (e.offsetX > element.clientWidth - BORDER_SIZE) {
				posStartX = e.clientX;
				elementStartX = element.clientWidth;
				resizeInProgress = true;
				document.addEventListener('mousemove', resizeHorizontal, false);
			}
		};
		let resizeHorizontal = (e: MouseEvent) => {
			e.preventDefault();
			posNewDistanceX = e.clientX - posStartX;
			let elementBorderX = element.offsetWidth - element.clientWidth;
			element.style.width =
				Math.round((elementStartX + posNewDistanceX) / gridSize) * gridSize -
				elementBorderX +
				2 +
				'px';
		};
		// yx ---------------------------------------------------------------------------------------------------------------
		let posNewDistanceY = 0,
			posStartY = 0,
			elementStartY = 0;
		let mouseDownListenerVertical = (e: MouseEvent) => {
			if (e.offsetY > element.clientHeight - BORDER_SIZE) {
				posStartY = e.clientY;
				elementStartY = element.clientHeight;
				resizeInProgress = true;
				document.addEventListener('mousemove', resizeVertical, false);
			}
		};
		let resizeVertical = (e: MouseEvent) => {
			e.preventDefault();
			posNewDistanceY = e.clientY - posStartY;
			let elementBorderY = element.offsetHeight - element.clientHeight;
			element.style.height =
				Math.round((elementStartY + posNewDistanceY) / gridSize) * gridSize -
				elementBorderY +
				2 +
				'px';
		};

		// yx ---------------------------------------------------------------------------------------------------------------
		let resizeInProgress = false;

		element.addEventListener(
			'mousedown',
			function (e) {
				if (resizeType == ResizeType.horizontal || resizeType == ResizeType.both) {
					mouseDownListenerHorizontal(e);
				}
				if (resizeType == ResizeType.vertical || resizeType == ResizeType.both) {
					mouseDownListenerVertical(e);
				}
			},
			false
		);

		document.addEventListener(
			'mouseup',
			function () {
				document.body.style.cursor = '';
				if (resizeType == ResizeType.horizontal || resizeType == ResizeType.both) {
					document.removeEventListener('mousemove', resizeHorizontal, false);
				}
				if (resizeType == ResizeType.vertical || resizeType == ResizeType.both) {
					document.removeEventListener('mousemove', resizeVertical, false);
				}
				if (resizeInProgress) {
					resizeInProgress = false;
					resizeEvent.emit(true);
				}
			},
			false
		);
		// yx ---------------------------------------------------------------------------------------------------------------
		element.addEventListener(
			'mousemove',
			function (e) {
				if (resizeType == ResizeType.horizontal) {
					if (e.offsetX >= element.clientWidth - BORDER_SIZE) {
						document.body.style.cursor = 'w-resize';
					} else {
						resizeInProgress
							? (document.body.style.cursor = 'w-resize')
							: (document.body.style.cursor = '');
					}
				}
				if (resizeType == ResizeType.vertical) {
					if (e.offsetY >= element.clientHeight - BORDER_SIZE) {
						element.style.cursor = 'n-resize';
					} else {
						if (!resizeInProgress) element.style.cursor = '';
					}
				}
				if (resizeType == ResizeType.both) {
					if (
						e.offsetX >= element.clientWidth - BORDER_SIZE &&
						e.offsetY >= element.clientHeight - BORDER_SIZE
					) {
						element.style.cursor = 'se-resize';
					} else if (e.offsetX >= element.clientWidth - BORDER_SIZE) {
						element.style.cursor = 'w-resize';
					} else if (e.offsetY >= element.clientHeight - BORDER_SIZE) {
						element.style.cursor = 'n-resize';
					} else {
						if (!resizeInProgress) element.style.cursor = '';
					}
				}
			},
			false
		);
		// yx ---------------------------------------------------------------------------------------------------------------
		element.addEventListener(
			'mouseleave',
			function (e) {
				resizeInProgress
					? (document.body.style.cursor = 'w-resize')
					: (document.body.style.cursor = '');
			},
			false
		);

		return resizeEvent;
	}

	static grabInit(elementDiv: HTMLDivElement) {
		let pos = { top: 0, left: 0, x: 0, y: 0 };

		const mouseDownHandler = function (e: MouseEvent) {
			e.stopPropagation();
			e.preventDefault();
			if (e.button === 0) {
				// e = e || window.event
				e.stopPropagation();
				//e.preventDefault()
				pos = {
					left: elementDiv.scrollLeft,
					top: elementDiv.scrollTop,
					// Get the current mouse position
					x: e.clientX,
					y: e.clientY
				};
				document.addEventListener('mousemove', mouseMoveHandler);
				document.addEventListener('mouseup', mouseUpHandler);
			}
		};
		const mouseMoveHandler = function (e: MouseEvent) {
			// e = e || window.event
			e.preventDefault();
			e.stopPropagation();
			// How far the mouse has been moved
			const dx = e.clientX - pos.x;
			const dy = e.clientY - pos.y;

			// Move the object
			elementDiv.scrollTop = pos.top - dy;
			elementDiv.scrollLeft = pos.left - dx;
		};

		const mouseUpHandler = function () {
			//TODO event es mentes
			document.removeEventListener('mousemove', mouseMoveHandler);
			document.removeEventListener('mouseup', mouseUpHandler);
		};
		elementDiv.addEventListener('mousedown', mouseDownHandler);
	}

	static cssPreventInit() {
		let cssPreventNodeModification = document.createElement('style');
		cssPreventNodeModification.innerText = '.NodeDivMrkS * {all: revert;  * {    all: unset;  }}';
		document.body.appendChild(cssPreventNodeModification);
	}

	static htmlToElement(html: string) {
		let template = document.createElement('template');
		html = html.trim(); // Never return a text nodeObject of whitespace as the result
		template.innerHTML = html;
		return template.content.firstChild;
	}

	static contextMenuInvisibleIfBackGroundClickInit() {
		let backgroundClickEvent = new TypedEvent();

		// @ts-ignore
		document.backgroundClickEvent = backgroundClickEvent;
		var handler = (event: any) => {
			if (
				!event.path.find((element: any) => {
					if (element == document || element == window) {
					} else {
						return element.classList.contains('ContextMenuLayr');
					}
				})
			) {
				backgroundClickEvent.emit(true);
			}
		};
		document.body.addEventListener('click', handler, true);
		document.body.addEventListener('contextmenu', handler, true);
	}

	static randomColor() {
		return '#' + Math.floor(Math.random() * 16777215).toString(16);
	}

	static mousePositionInit() {
		document.addEventListener('mousemove', (ev) => {
			mousePositionMrk = ev;
		});
	}

	static emptyObjectCheck(obj: object) {
		if (!obj) return true;
		return Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype;
	}

	static generateUUID() {
		let d = new Date().getTime(),
			d2 = (performance && performance.now && performance.now() * 1000) || 0;
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
			let r = Math.random() * 16;
			if (d > 0) {
				r = (d + r) % 16 | 0;
				d = Math.floor(d / 16);
			} else {
				r = (d2 + r) % 16 | 0;
				d2 = Math.floor(d2 / 16);
			}
			return (c == 'x' ? r : (r & 0x7) | 0x8).toString(16);
		});
	}

	static generateShortId() {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		var charactersLength = characters.length;
		for (var i = 0; i < 10; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	static splitUrlByBackSlash(url: string) {
		return url.split('/');
	}

	static getDocIdByUrl(): string | undefined {
		return MrkLib.splitUrlByBackSlash(window.location.hash.substr(1))[0];
	}

	static getFieldIdByUrl(): string | undefined {
		return MrkLib.splitUrlByBackSlash(window.location.hash.substr(1))[1];
	}

	static doTwoElementsOverlap(elementOne: HTMLElement, elementTwo: HTMLElement) {
		let elementOneBound = elementOne.getBoundingClientRect();
		let elementTwoBound = elementTwo.getBoundingClientRect();
		let elementOnePos = MrkLib.getElementPositionInParentDiv(elementOne);
		let elementTwoPos = MrkLib.getElementPositionInParentDiv(elementTwo);
		let valasz: { x: boolean; y: boolean } = { x: false, y: false };
		if (
			elementOnePos.y <= elementTwoPos.y &&
			elementOnePos.y + elementOneBound.height > elementTwoPos.y
		) {
			valasz.y = true;
		}
		if (
			elementOnePos.y < elementTwoPos.y + elementTwoBound.height &&
			elementOnePos.y + elementOneBound.height >= elementTwoPos.y + elementTwoBound.height
		) {
			valasz.y = true;
		}

		if (
			elementOnePos.x <= elementTwoPos.x &&
			elementOnePos.x + elementOneBound.width > elementTwoPos.x
		) {
			valasz.x = true;
		}
		if (
			elementOnePos.x < elementTwoPos.x + elementTwoBound.width &&
			elementOnePos.x + elementOneBound.width >= elementTwoPos.x + elementTwoBound.width
		) {
			valasz.x = true;
		}
		return valasz;
	}

	static getElementIndex(element: HTMLElement) {
		if (!element.parentNode) return 0;
		return Array.from(element.parentNode.children).indexOf(element);
	}

	static shadowForOverlappingNodesOnce(parentDiv: HTMLDivElement) {
		let elementArray: { element: HTMLElement; topPosition: number }[] = [];
		//@ts-ignore
		for (let element of parentDiv.children) {
			let el = element as HTMLElement;
			el.style.boxShadow = '';
			elementArray.push({ element: el, topPosition: MrkLib.getElementPositionInParentDiv(el).y });
		}

		function compare(
			a: { element: HTMLElement; topPosition: number },
			b: { element: HTMLElement; topPosition: number }
		) {
			if (a.topPosition < b.topPosition) {
				return -1;
			}
			if (a.topPosition > b.topPosition) {
				return 1;
			}
			return 0;
		}

		elementArray.sort(compare);
		let YOverLappingParok: { egyikElement: HTMLElement; masikElement: HTMLElement }[] = [];

		elementArray.forEach((elementData, index) => {
			let egyikElement = elementData.element;

			let masikElementActual: number = index + 1;

			if (elementArray.length > masikElementActual) {
				let masikElement = elementArray[masikElementActual];
				let overlap = MrkLib.doTwoElementsOverlap(egyikElement, masikElement.element);
				while (overlap.y) {
					if (elementArray.length > masikElementActual) {
						masikElement = elementArray[masikElementActual];
						overlap = MrkLib.doTwoElementsOverlap(egyikElement, masikElement.element);
						if (overlap.x && overlap.y) {
							YOverLappingParok.push({ egyikElement, masikElement: masikElement.element });
						}
					} else {
						overlap.y = false;
					}
					masikElementActual++;
				}
			}
		});

		YOverLappingParok.forEach((elementPar, index) => {
			if (
				MrkLib.getElementIndex(elementPar.egyikElement) >
				MrkLib.getElementIndex(elementPar.masikElement)
			) {
				elementPar.egyikElement.style.boxShadow = '5px 5px 5px ';
			} else {
				elementPar.masikElement.style.boxShadow = '5px 5px 5px ';
			}
		});
	}

	static twoObjectsSameCheck(obj1: Object, obj2: Object) {
		if (!obj1 || !obj2) return;

		const obj1Length = Object.keys(obj1).length;
		const obj2Length = Object.keys(obj2).length;

		if (obj1Length === obj2Length) {
			return Object.keys(obj1).every(
				(key) =>
					obj2.hasOwnProperty(key) &&
					// @ts-ignore
					obj2[key] === obj1[key]
			);
		}
		return false;
	}

	static twoObjectsSameCheck2(obj1: Object | undefined, obj2: Object | undefined) {
		if (!obj1 || !obj2) return false;
		if (JSON.stringify(obj1) == JSON.stringify(obj2)) return true;
		return false;
	}
	static changeObjectKey(oMap: object, oldKey: string, newKey: string) {
		delete Object.assign(oMap, { [newKey]: oMap[oldKey] })[oldKey];
	}
	static forEachInObject<objectsType, keyEnum = string>(
		object: object | omap<objectsType, keyEnum | string >,
		forEachCallback: (object: objectsType, key: keyEnum) => any
	) {
		if (typeof object != 'object' || !object) return;
		for (const [k, v] of Object.entries(object)) {
			forEachCallback(v, k);
		}
	}

	/*
        static forEachFieldInObject(object: Object, callback: (elementKey: string) => any) {
            for (const elementKey2 in object) {
                if (Object.prototype.hasOwnProperty.call(object, elementKey2)) {
                    callback(elementKey2)
                }
            }
        }*/

	static shadowForOverlappingNodesPermanent(parentDiv: HTMLDivElement) {
		let elementArrayElozo: { top: string; left: string; width: string; height: string }[] = [];
		MrkLib.shadowForOverlappingNodesOnce(parentDiv);

		setInterval(() => {
			let elementArrayUj: { top: string; left: string; width: string; height: string }[] = [];
			// @ts-ignore
			for (let element of parentDiv.children) {
				let elem = element as HTMLElement;

				elementArrayUj.push({
					top: elem.style.top,
					left: elem.style.left,
					width: elem.style.width,
					height: elem.style.height
				});
			}
			let vanKulonb = false;
			for (let key = 0; key < elementArrayUj.length; key++) {
				let value = elementArrayUj[key];
				if (key < elementArrayElozo.length) {
					if (!MrkLib.twoObjectsSameCheck(value, elementArrayElozo[key])) {
						vanKulonb = true;
						break;
					}
				}
			}

			if (vanKulonb) {
				MrkLib.shadowForOverlappingNodesOnce(parentDiv);
			} else {
			}

			elementArrayElozo = elementArrayUj;
		}, 1000);
	}

	static childrenMutationObserver(
		targetNode: HTMLElement,
		callback2: (mutations: MutationRecord[], observer: MutationObserver) => void
	) {
		const config = { childList: true, subtree: true, attributeFilter: ['style'] };

		let callback = function (mutations: MutationRecord[], observer: MutationObserver) {
			console.log(mutations);
			for (let mutation of mutations) {
				if (mutation.type === 'childList') {
					//csak az uj nodeknal
					callback2(mutations, observer);
				}
			}
		};

		const observer = new MutationObserver(callback);
		observer.observe(targetNode, config);
		console.log(observer);
	}

	static getElementPositionInParentDiv(element: HTMLElement) {
		if (!element.parentElement) return { y: 0, x: 0 };
		let rect = element.parentElement.getBoundingClientRect();

		let x = element.parentElement.scrollLeft - rect.left + element.getBoundingClientRect().left;
		let y = element.parentElement.scrollTop - rect.top + element.getBoundingClientRect().top;

		return { y, x };
	}

	static isValidHttpUrl(urlstring: string) {
		let url;

		try {
			url = new URL(urlstring);
		} catch (_) {
			return false;
		}

		return url.protocol === 'http:' || url.protocol === 'https:';
	}

	static getCookie(name: string, cookies: string) {
		const value = `; ${cookies}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop()?.split(';').shift();
	}

	static getJSONCookie(name: string, cookies: string) {
		let part = MrkLib.getCookie(name, cookies);
		if (!part) return;
		let jsonstring = decodeURIComponent(part);
		if (!jsonstring) return;
		return JSON.parse(jsonstring);
	}

	static deleteAllCookies() {
		let cookies = document.cookie.split(';');

		for (var i = 0; i < cookies.length; i++) {
			let cookie = cookies[i];
			let eqPos = cookie.indexOf('=');
			let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
		}
	}

	static getFieldAsText(field: () => any) {
		let obj = { f: field };
		let funcString = obj.f.toString();
		const result = funcString.split('.')[2].replace(';', '').replace('}', '');
		return result;
	}

	static splitArrayDataByValue<DataType>(
		arrayOfData: DataType[],
		checkFunction: (data: DataType) => boolean
	) {
		let splittedArray: { true: any[]; false: any[] } = { true: [], false: [] };
		arrayOfData.forEach((value) => {
			if (checkFunction(value)) {
				splittedArray.true.push(value);
			} else {
				splittedArray.false.push(value);
			}
		});
		return splittedArray;
	}

	static findIn_idArray<arrayType extends { _id: string }>(_idArray: arrayType[], _id: string) {
		return _idArray.find((value) => {
			return value._id == _id;
		});
	}

	static createMissingFields<objectType extends object>(
		objectToCheck: any,
		objectBase: objectType
	) {
		createMissingFields(objectToCheck, objectBase);

		function createMissingFields(fieldToCheck: object, fieldBase: object) {
			if (typeof fieldToCheck != 'object') return;
			MrkLib.forEachInObject(fieldBase, (field: object, key) => {
				// @ts-ignore
				let a = fieldToCheck[key];
				if (a == undefined) {
					a = field;
				}
				if (!MrkLib.emptyObjectCheck(field)) {
					createMissingFields(a, field);
				}
			});
		}

		return objectToCheck;
	}
}

export let mousePositionMrk: MouseEvent;

export enum ResizeType {
	horizontal = 'horizontal',
	vertical = 'vertical',
	both = 'both'
}
