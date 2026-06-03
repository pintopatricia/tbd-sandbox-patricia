const scrollToTop = (): void => {
  /*
   * Global scrollable is not available on the desktop template.
   * So we need to scroll the middle section to the top instead of the window.
   * To do that, we add an identifier to the middle element.
   * */
  const elementToScroll = document.getElementById("scrollable-desktop-container") || window;

  elementToScroll.scrollTo(0, 0);
};

export default scrollToTop;
