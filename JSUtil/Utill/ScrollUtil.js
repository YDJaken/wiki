import {dependencies, getTimestamp} from "../Constants";
import Check from "./Check";
import ObjectUtil from "./ObjectUtil";

const scrollConfig = {
    styleEle: null,
    currentStatus: 'none',
    updateTime: null
};

const scrollCallback = () => {
    if (scrollConfig.currentStatus === '') {
        let now = getTimestamp();
        if (now - scrollConfig.updateTime > 1000) {
            scrollConfig.currentStatus = 'none';
            scrollConfig.styleEle.style.display = scrollConfig.currentStatus;
        } else {
            requestAnimationFrame(scrollCallback);
        }
    }
};

const scrollFunction = () => {
    if (!Check.checkDefined(scrollConfig.styleEle)) {
        return;
    }
    if (scrollConfig.currentStatus === 'none') {
        scrollConfig.currentStatus = '';
        scrollConfig.styleEle.style.display = scrollConfig.currentStatus;
        requestAnimationFrame(scrollCallback);
    }
    scrollConfig.updateTime = getTimestamp();
};

const scrollCallbackDom = (dom, originSetting) => {
    return () => {
        let now = getTimestamp();
        if (now - originSetting.updateTime > 1000) {
            dom.style.overflowX = 'hidden';
            dom.style.overflowY = 'hidden';
        } else {
            requestAnimationFrame(scrollCallbackDom(dom, originSetting));
        }
    };
};

const scrollFunctionDom = (dom, originSetting) => {
    dom.style.overflowX = 'hidden';
    dom.style.overflowY = 'hidden';
    return () => {
        if (dom.style.overflowX === 'hidden' && dom.style.overflowX === 'hidden') {
            dom.style.overflowX = originSetting.OX;
            dom.style.overflowY = originSetting.OY;
            requestAnimationFrame(scrollCallbackDom(dom, originSetting));
        }
        originSetting.updateTime = getTimestamp();
    }
};

export default class ScrollUtil {
    static checkGlobalScroll() {
        if (Check.checkDefined(scrollConfig.styleEle)) {
            return;
        }
        let sheets = dependencies.top.document.styleSheets;
        L1:for (let i = 0; i < sheets.length; i++) {
            let list = sheets[i].cssRules;
            for (let j = 0; j < list.length; j++) {
                let target = list[j];
                if (target.selectorText && target.selectorText === "::-webkit-scrollbar-thumb") {
                    scrollConfig.styleEle = target;
                    break L1;
                }
            }
        }
    }


    static activeScrollAnimation(dom) {
        if (!Check.checkDefined(dom)) {
            if (!Check.checkDefined(scrollConfig.styleEle)) {
                ScrollUtil.checkGlobalScroll();
            }
            if (!Check.checkDefined(scrollConfig.styleEle)) {
                return;
            }
            scrollConfig.styleEle.style.display = scrollConfig.currentStatus;
            dependencies.top.document.removeEventListener('wheel', scrollFunction);
            dependencies.top.document.addEventListener('wheel', scrollFunction);
        } else {
            let originSetting = {
                OX: dom.style.overflowX,
                OY: dom.style.overflowY,
                updateTime: getTimestamp()
            };
            let added = scrollFunctionDom(dom, originSetting);
            dom.addEventListener('wheel', added);
            return () => {
                ObjectUtil.deleteComplete(originSetting);
                dom.removeEventListener('wheel', added);
            };
        }
    }
}