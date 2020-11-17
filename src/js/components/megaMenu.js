class MegaMenu {
  constructor() {
    this.items = document.querySelectorAll('.megamenu__item');
  };

  init() {
    this.checkElements();
    this.addListeners();
  };

  /**
   * Make sure everything is set up
   */
  checkElements() {
    if (!this.items) false;
  };

  addListeners() {
    this.items.forEach(item => {
      item.addEventListener('mouseenter', this.itemHover);
      item.addEventListener('focus', this.itemHover);
      item.addEventListener('mouseleave', this.itemHover);
      item.addEventListener('blur', this.itemHover);
    });
  };


  itemHover(event) {
    const { type, currentTarget } = event;
    const subMenu = currentTarget.querySelector('.megamenu__items');

    if(!subMenu) return;

    if ((type === 'mouseenter' || type === 'focus') && !subMenu.classList.contains('active')) {
      subMenu.classList.add('active');
    }
    if ((type === 'mouseleave' || type === 'blur') && subMenu.classList.contains('active')) {
      subMenu.classList.remove('active');
    }
  };
};

export default () => {
  const megaMenu = new MegaMenu;
  megaMenu.init();
};
