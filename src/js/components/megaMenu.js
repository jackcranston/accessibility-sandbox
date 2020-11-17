import { getKeypress } from '../helpers/keys';

class MegaMenu {
  constructor(megaMenu) {
    this.megaMenu = megaMenu;
    this.megaMenuTrigger = megaMenu.closest('.menu__item--megamenu');
    this.items = megaMenu.querySelectorAll('.megamenu__item');
  };

  init() {
    this.checkElements();
    this.addListeners();
  };

  /**
   * Make sure everything is set up
   */
  checkElements() {
    if (!this.items || !this.megaMenuTrigger || !this.megaMenu) false; // !TODO needs extending to all properties
  };

  addListeners() {
    const { megaMenu, megaMenuTrigger, items, megaMenuHover, itemHover, handleKeypress} = this;

    megaMenuTrigger.addEventListener('mouseenter', (event) => {
      megaMenuHover(event, megaMenu);
      itemHover(event);
    });
    megaMenuTrigger.addEventListener('mouseleave', (event) => {
      megaMenuHover(event, megaMenu);
      itemHover(event);
    });
    megaMenuTrigger.addEventListener('keyup', handleKeypress);

    items.forEach(item => {
      item.addEventListener('mouseenter', itemHover);
      //item.addEventListener('focus', this.itemHover);
      item.addEventListener('mouseleave', itemHover);
      //item.addEventListener('blur', this.itemHover);
      item.addEventListener('keyup', handleKeypress);
    });
  };

  megaMenuHover(event, megaMenu) {
    const { type } = event;

    if ((type === 'mouseenter' || type === 'focus') && !megaMenu.classList.contains('active')) {
      megaMenu.classList.add('active');
      megaMenu.setAttribute('aria-hidden', false);
    }
    if ((type === 'mouseleave' || type === 'blur') && megaMenu.classList.contains('active')) {
      megaMenu.classList.remove('active');
      megaMenu.setAttribute('aria-hidden', true);
    }
  }

  itemHover(event) {
    const { type, currentTarget } = event;
    const subMenu = currentTarget.querySelector('.megamenu__items');

    if(!subMenu) return;

    if ((type === 'mouseenter' || type === 'focus') && !subMenu.classList.contains('active')) {
      subMenu.classList.add('active');
      subMenu.setAttribute('aria-hidden', false);
    }
    if ((type === 'mouseleave' || type === 'blur') && subMenu.classList.contains('active')) {
      subMenu.classList.remove('active');
      subMenu.setAttribute('aria-hidden', true);
    }
  };

  handleKeypress(event) {
    const keyPressed = getKeypress(event);

    switch (keyPressed) {
      case 'UP':
        break;
      // ARROW - CONTROL DIRECTION / FLOW
      // SPACE - ACTIVE
      // ENTER - ENTER LINK
      // TAB - NEXT ITEM IN HERIARCHY
    }
  }
};

export default () => {
  const megaMenus = document.querySelectorAll('.megamenu');

  megaMenus.forEach(megaMenu => {
    const megaMenuObject = new MegaMenu(megaMenu);
    megaMenuObject.init();
  });
};
