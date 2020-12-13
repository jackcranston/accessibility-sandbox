import { getKeypress } from '../helpers/keys';

class MegaMenu {
  constructor(megaMenu) {
    this.megaMenu = megaMenu;
    this.megaMenuTrigger = megaMenu.closest('.menu__item--megamenu');
    this.links = [...megaMenu.querySelectorAll('.megamenu__link')];
    this.itemLists = [...megaMenu.querySelectorAll('.megamenu__items')];
  };

  init() {
    this.checkElements();
    this.addListeners();
  };

  /**
   * Make sure everything is set up
   */
  checkElements() {
    if (!this.links || !this.megaMenuTrigger || !this.megaMenu) false; // TODO needs extending to all properties
  };

  /**
   * Set event listeners
   */
  addListeners() {
    const { megaMenuTrigger, links, megaMenuHover, itemHover, itemLeave, handleKeypress, megaMenuKeypress } = this;

    megaMenuTrigger.addEventListener('mouseenter', megaMenuHover.bind(this));
    megaMenuTrigger.addEventListener('focus', megaMenuHover.bind(this));
    megaMenuTrigger.addEventListener('mouseleave', megaMenuHover.bind(this));
    megaMenuTrigger.addEventListener('blur', megaMenuHover.bind(this));
    megaMenuTrigger.addEventListener('keyup', megaMenuKeypress.bind(this));

    links.forEach((item) => {
      item.addEventListener('mouseenter', itemHover);
      item.addEventListener('focus', itemHover);
      item.addEventListener('keyup', handleKeypress.bind(this));
    });
  };

  /**
   * @param {HTMLElement} megaMenu
   * @param {Array} itemLists array of HTMLElements
   */
  megaMenuOpen(megaMenu, itemLists) {
    megaMenu.classList.add('active');
    megaMenu.setAttribute('aria-hidden', false);
    itemLists[0].classList.add('active');
    itemLists[0].setAttribute('aria-hidden', false);
  }

  /**
   * @param {HTMLElement} megaMenu 
   * @param {Array} itemLists array of HTMLElements
   */
  megaMenuClose(megaMenu, itemLists) {
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

  megaMenuHover(event) {
    const { megaMenu, itemLists, megaMenuOpen } = this;
    const { type } = event;

    if ((type === 'mouseenter' || type === 'focus') && !megaMenu.classList.contains('active')) {
      megaMenuOpen(megaMenu, itemLists);
    }

    if ((type === 'mouseleave' || type === 'blur') && megaMenu.classList.contains('active')) {
      megaMenu.classList.remove('active');
      megaMenu.setAttribute('aria-hidden', true);
    }
  }

  /**
   * Handles when user hovers over menu item
   * @param {Event} event 
   */
  itemHover(event) {
    const { type, currentTarget } = event;
    const parentList = currentTarget.closest('.megamenu__items');
    const parentItem = currentTarget.closest('.megamenu__item');
    const nextSubMenu = parentItem.querySelector('.megamenu__items');
    const activeItems = parentList.querySelectorAll('.active');

    activeItems.forEach((activeItem) => {
      activeItem.classList.remove('active');
      activeItem.setAttribute('aria-hidden', true);
    });

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

  /**
   * Handles keypress when focused on megamenu root element
   * @param {Event} event 
   */
  megaMenuKeypress(event) {
    const { megaMenu, itemLists, megaMenuOpen, megaMenuClose } = this;
    const keyPressed = getKeypress(event);

    switch(keyPressed) {
      case 'SPACE':
        if (!megaMenu.classList.contains('active')) {
          megaMenuOpen(megaMenu, itemLists);
        } else {
          megaMenuClose(megaMenu, itemLists);
        }
        break;
      case 'ESC':
        if (megaMenu.classList.contains('active')) {
          megaMenuClose(megaMenu, itemLists);
        }
        break;
    }
  };

  /**
   * Handles keypress when focused on megamenu item
   * @param {Event} event 
   */
  handleKeypress(event) {
    event.stopPropagation();
    const { megaMenu, itemLists, megaMenuClose, focusPrevOfCurrent, focusNextOfCurrent, focusFirstOfCurrent, focusLastOfCurrent, focusChildOfCurrent, focusParentOfCurrent } = this;
    const { currentTarget } = event;
    const keyPressed = getKeypress(event);
    const currentItem = currentTarget.closest('.megamenu__item');

    switch (keyPressed) {
      case 'UP':
        focusPrevOfCurrent(currentItem);
        break;
      case 'DOWN':
        focusNextOfCurrent(currentItem);
        break;
      case 'RIGHT':
        focusChildOfCurrent(currentItem);
        break;
      case 'LEFT':
        focusParentOfCurrent(currentItem);
        break;
      case 'SPACE':
        focusChildOfCurrent(currentItem);
        break;
      case 'ESC':
        megaMenuClose(megaMenu, itemLists);
        break;
      case 'HOME':
        focusFirstOfCurrent(currentItem);
        break;
      case 'END' :
        focusLastOfCurrent(currentItem);
        break;
    }
  };

  focusPrevOfCurrent(currentItem) {
    if (!currentItem.previousElementSibling) return;

    const prevItem = currentItem.previousElementSibling.querySelector('.megamenu__link');
    prevItem.focus();
  };

  focusNextOfCurrent(currentItem) {
    if (!currentItem.nextElementSibling) return;

    const nextItem = currentItem.nextElementSibling.querySelector('.megamenu__link');
    nextItem.focus();
  };

  focusFirstOfCurrent(currentItem) {
    const currentList = currentItem.closest('.megamenu__items');
    const currentListLinks = currentList.querySelectorAll(':scope > .megamenu__item > .megamenu__link'); // NOTE: :scope not supported in IE

    currentListLinks[0].focus();
  };

  focusLastOfCurrent(currentItem) {
    const currentList = currentItem.closest('.megamenu__items');
    const currentListLinks = currentList.querySelectorAll(':scope > .megamenu__item > .megamenu__link'); // NOTE: :scope not supported in IE

    currentListLinks[currentListLinks.length - 1].focus();
  };

  focusChildOfCurrent(currentItem) {
    const innerList = currentItem.querySelector('.megamenu__items');
    if (!innerList) return;

    const innerListLinks = innerList.querySelectorAll(':scope > .megamenu__item > .megamenu__link'); // NOTE: :scope not supported in IE
    innerListLinks[0].focus();
  };

  focusParentOfCurrent(currentItem) {
    const currentOuterList = currentItem.closest('.megamenu__items');
    const prevItem = currentOuterList.closest('.megamenu__item');
    if (!prevItem) return;

    const prevLink = prevItem.querySelector('.megamenu__link');
    prevLink.focus();
  };
};

export default () => {
  const megaMenus = document.querySelectorAll('.megamenu');

  megaMenus.forEach(megaMenu => {
    const megaMenuObject = new MegaMenu(megaMenu);
    megaMenuObject.init();
  });
};
