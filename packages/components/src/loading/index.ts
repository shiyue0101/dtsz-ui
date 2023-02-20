import { createApp, DirectiveBinding } from "vue";
import DtszLoading from "./Loading.vue";

const relative = "g-relative";
const hidden = "g-hidden";

// TODO: 整理代码

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const append = (el: any) => {
  const style: CSSStyleDeclaration = getComputedStyle(el);
  el.classList.add(hidden);
  if (["absolute", "relative", "fixed"].indexOf(style.position) === -1) {
    el.classList.add(relative);
  }
  el.appendChild(el.instance.$el);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const remove = (el: any) => {
  el.removeChild(el.instance.$el);
  el.classList.remove(relative);
  el.classList.remove(hidden);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const directives = (el: any) => {
  if (el.getAttribute("dtsz-loading-text")) {
    el.instance.setText(el.getAttribute("dtsz-loading-text"));
  }
  if (el.getAttribute("dtsz-loading-spinner")) {
    const circle = document.getElementsByClassName("path")[0];
    circle.insertAdjacentHTML(
      "beforebegin",
      el.getAttribute("dtsz-loading-spinner")
    );
    circle.remove();

    // 通过 insertAdjacentHTML 插入元素导致部分 css 样式丢失
    // 采用单独设置方法，目前暂未找到更好的办法
    const path = document.getElementsByClassName("path")[0] as HTMLElement;
    const animationName = `@keyframes loading-dash {
      0% {
        stroke-dasharray: 1, 126;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 95, 126;
        stroke-dashoffset: -31px;
      }
      to {
        stroke-dasharray: 6, 120;
        stroke-dashoffset: -120px;
      }
    }`;
    const sheet = document.styleSheets[0];
    sheet.insertRule(animationName, 0);
    path.style.animation = "loading-dash 1.5s ease-in-out infinite";
    path.style.strokeDasharray = "90, 150";
    path.style.strokeDashoffset = "0";
    path.style.strokeWidth = "2";
    path.style.stroke = "#409eff";
    path.style.strokeLinecap = "round";
  }
  if (el.getAttribute("dtsz-loading-svg-view-box")) {
    const circular = document.getElementsByClassName("circular")[0];
    circular.setAttribute(
      "viewBox",
      el.getAttribute("dtsz-loading-svg-view-box")
    );
  }
  if (el.getAttribute("dtsz-loading-background")) {
    const mask = document.getElementsByClassName(
      "dtsz-loading-mask"
    )[0] as HTMLElement;
    mask.style.backgroundColor = el.getAttribute("dtsz-loading-background");
  }
};

export const loadingDirective = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mounted(el: any, binding: DirectiveBinding) {
    const app = createApp(DtszLoading);
    const instance = app.mount(document.createElement("div"));
    el.instance = instance;

    if (binding.value) {
      append(el);
    }
    // if (binding.arg !== "undefined") {
    //   el.instance.setText(binding.arg);
    // }
    directives(el);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  updated(el: any, binding: DirectiveBinding) {
    // if (binding.arg !== "undefined") {
    //   el.instance.setText(binding.arg);
    // }

    // binding.value（boolean）有所改变
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el);
    }
    directives(el);
  },
};
