import { getKeypress } from '../helpers/keys';

class MegaMenu {
  constructor(megaMenu) {
    this.megaMenu = megaMenu;
    this.megaMenuTrigger = megaMenu.closest('.menu__item--megamenu');
    this.links = megaMenu.querySelectorAll('.megamenu__link');
    this.itemLists = megaMenu.querySelectorAll('.megamenu__items');
  };

  init() {
    this.checkElements();
    this.addListeners();
  };

  /**
   * Make sure everything is set up
   */
  checkElements() {
    if (!this.links || !this.megaMenuTrigger || !this.megaMenu) false; // !TODO needs extending to all properties
  };

  addListeners() {
    const { megaMenu, megaMenuTrigger, links, itemLists, megaMenuHover, itemHover, handleKeypress } = this;

    megaMenuTrigger.addEventListener('mouseenter', (event) => {
      megaMenuHover(event, megaMenu, itemLists);
    });
    megaMenuTrigger.addEventListener('mouseleave', (event) => {
      megaMenuHover(event, megaMenu, itemLists);
    });
    megaMenuTrigger.addEventListener('focus', (event) => {
      megaMenuHover(event, megaMenu, itemLists);
    });
    megaMenuTrigger.addEventListener('blur', (event) => {
      megaMenuHover(event, megaMenu);
    });
    megaMenuTrigger.addEventListener('keyup', handleKeypress);

    links.forEach((item) => {
      item.addEventListener('mouseenter', itemHover);
      item.addEventListener('focus', itemHover);
      //item.addEventListener('mouseleave', itemHover);
      item.addEventListener('blur', itemHover);
      item.addEventListener('keyup', handleKeypress);
    });
  };

  megaMenuHover(event, megaMenu, itemLists) {
    const { type } = event;

    if ((type === 'mouseenter' || type === 'focus') && !megaMenu.classList.contains('active')) {
      megaMenu.classList.add('active');
      megaMenu.setAttribute('aria-hidden', false);
      itemLists[0].classList.add('active');
      itemLists[0].setAttribute('aria-hidden', false);
    }
    if ((type === 'mouseleave' || type === 'blur') && megaMenu.classList.contains('active')) {
      megaMenu.classList.remove('active');
      megaMenu.setAttribute('aria-hidden', true);
    }
  }

  itemHover(event) {
    const { type, currentTarget } = event;
    const parentList = currentTarget.closest('.megamenu__items');
    const nextSubMenu = parentList.querySelector('.megamenu__items');
    const prevLink = parentList.querySelector('.active');

    if (prevLink) {
      const prevSubMenus = prevLink.querySelectorAll('.megamenu__items');

      prevSubMenus.forEach((prevSubMenu) => {
        prevSubMenu.classList.remove('active');
        prevSubMenu.setAttribute('aria-hidden', true);
      });
    }

    if (!nextSubMenu) return;

    if ((type === 'mouseenter' || type === 'focus') && !nextSubMenu.classList.contains('active')) {
      nextSubMenu.classList.add('active');
      nextSubMenu.setAttribute('aria-hidden', false);
    }
    if ((type === 'mouseleave' || type === 'blur') && nextSubMenu.classList.contains('active')) {
      nextSubMenu.classList.remove('active');
      nextSubMenu.setAttribute('aria-hidden', true);
    }
  };

  closeMegaMenu() {
    const { megaMenu, itemLists } = this;

    if (megaMenu.classList.contains('active')) {
      megaMenu.classList.remove('active');
      megaMenu.setAttribute('aria-hidden', true);
    }
  
    itemLists.forEach(itemList => {
      if (itemList.classList.contains('active')) {
        itemList.classList.remove('active');
        itemList.setAttribute('aria-hidden', true);
      }
    });
  };


  handleKeypress(event) {
    const { closeMegaMenu } = this;
    const { currentTarget } = event;
    const keyPressed = getKeypress(event);
    const currentItem = currentTarget.closest('.megamenu__item');

    switch (keyPressed) {
      case 'UP':
        currentItem.previousElementSibling.querySelector('a').focus();
        break;
      case 'DOWN':
        currentItem.nextElementSibling.querySelector('a').focus();
        break;
      case 'RIGHT': 
        break;
      case 'LEFT':
        break;
      case 'SPACE':
        break;
      case 'ENTER':
        break;
      case 'TAB':
        currentItem.nextElementSibling.querySelector('a').focus();
        break;
      case 'ESC':
        closeMegaMenu();
        break;
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
