const overrideKeyDownEvent = () => {
  document.addEventListener("keydown", function(e) {
    if (e.keyCode === 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
      e.preventDefault();
    }
  }, false);
};

export default overrideKeyDownEvent;