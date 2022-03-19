var WindowEffects = (function () {
  function init() {
    //获取背景
    var overlay = document.querySelector(".md-overlay");
    //获取所有按钮并遍历操作
    document.querySelectorAll(".md-trigger").forEach(function (el, i) {
      //获取当前按钮
      var modal = document.querySelector("#" + el.getAttribute("data-modal"));
      //获取关闭按钮
      var close = modal.querySelector(".md-close");
      //给按钮添加事件
      el.addEventListener("click", () => {
        modal.classList.add("md-show");
        overlay.removeEventListener("click", () => {
          modal.classList.remove("md-show");
          document.documentElement.classList.remove("md-perspective");
        });
        console.log(i);
        //给背景添加点击事件，用于点击背景关闭弹窗
        overlay.addEventListener("click", () => {
          modal.classList.remove("md-show");
          document.documentElement.classList.remove("md-perspective");
        });

        //动画效果
        setTimeout(function () {
          document.documentElement.classList.add("md-perspective");
        }, 25);

        //设置close按钮，用于关闭弹窗
        close.addEventListener("click", (ev) => {
          ev.stopPropagation();
          modal.classList.remove("md-show");

          document.documentElement.classList.remove("md-perspective");
        });
      });
    });
  }

  init();
})();
