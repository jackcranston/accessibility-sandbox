import { getKeypress } from '../helpers/keys';
import { getDevice } from '../helpers/devices';

class MegaMenu {
  constructor(megaMenu) {
    this.megaMenu = megaMenu;
    this.megaMenuTrigger = megaMenu.closest('.menu__item--megamenu');
    this.megaMenuTriggerLink = this.megaMenuTrigger.querySelector('.menu__link');
    this.links = [...megaMenu.querySelectorAll('.megamenu__link')];
    this.itemLists = [...megaMenu.querySelectorAll('.megamenu__items')];
    this.backButtons = [...megaMenu.querySelectorAll('.megamenu__back-button')];

    // binds this to avoid scope issues
    this.megaMenuInteraction = this.megaMenuInteraction.bind(this);
    this.handleKeypress = this.handleKeypress.bind(this);
    this.megaMenuKeypress = this.megaMenuKeypress.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
  };

  /**
   * Initialises megamenu
   */
  init() {
    this.checkElements();
    this.addListeners();
  };

  /**
   * Makes sure all necessary elements exist
   */
  checkElements() {
    if (!this.megaMenu || !this.megaMenuTrigger || !this.links.length || !this.itemLists.length ) false;
  };

  /**
   * Set event listeners
   */
  addListeners() {
    this.megaMenuTrigger.addEventListener('mouseenter', this.megaMenuInteraction);
    this.megaMenuTrigger.addEventListener('focus', this.megaMenuInteraction);
    this.megaMenuTrigger.addEventListener('mouseleave', this.megaMenuInteraction);
    this.megaMenuTrigger.addEventListener('blur', this.megaMenuInteraction);
    this.megaMenuTrigger.addEventListener('keyup', this.megaMenuKeypress);

    this.links.forEach((item) => {
      item.addEventListener('mouseenter', this.itemHover);
      item.addEventListener('focus', this.itemHover);
      item.addEventListener('keyup', this.handleKeypress);
    });

    this.backButtons.forEach((backButton) => {
      backButton.addEventListener('click', this.handleBackButton);
    });

    this.screenResizeDetection();
    this.screenResizeEventListener();
  };

  /**
   * Detects screen size change
   */
  screenResizeDetection() {
    const device = getDevice();
    console.log(device);

    if (device === 'MOBILE') {
      this.megaMenuTriggerLink.addEventListener('click', this.megaMenuInteraction);

      this.megaMenuTrigger.removeEventListener('mouseenter', this.megaMenuInteraction);
      this.megaMenuTrigger.removeEventListener('mouseleave', this.megaMenuInteraction);

      this.links.forEach((item) => {
        item.removeEventListener('mouseenter', this.itemHover);
      });
    } else if (device === 'DESKTOP') {
      this.megaMenuTriggerLink.removeEventListener('click', this.megaMenuInteraction);

      this.megaMenuTrigger.addEventListener('mouseenter', this.megaMenuInteraction);
      this.megaMenuTrigger.addEventListener('mouseleave', this.megaMenuInteraction);

      this.links.forEach((item) => {
        item.addEventListener('mouseenter', this.itemHover);
      });
    }
  }

  /**
   * Throttled screen resize event listener
   */
  screenResizeEventListener() {
    let throttleResize;

    window.addEventListener('resize', () => {
      if (!!throttleResize) clearTimeout(throttleResize);

      throttleResize = setTimeout(() => {
        this.screenResizeDetection();
      }, 200);
    })
  }

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

  /**
   * Handles first megamenu interaction
   * @param {Event} event 
   */
  megaMenuInteraction(event) {
    event.stopPropagation();
    const { type } = event;
    const device = getDevice();

    console.log(type);

    if ((type === 'mouseleave' || type === 'blur' || type === 'click') && this.megaMenu.classList.contains('active')) {
      this.megaMenu.classList.remove('active');
      this.megaMenu.setAttribute('aria-hidden', true);
    } else if (((device === 'DESKTOP') && (type === 'mouseenter' || type === 'focus')) || (device === 'MOBILE' && type === 'click')) {
      this.megaMenuOpen(this.megaMenu, this.itemLists);
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
    const nextPanel = parentItem.querySelector('.megamenu__items') || parentItem.querySelector('.megamenu__content');
    const activeItems = [...parentList.querySelectorAll('.active')];

    // clear any active items before showing next item
    if (activeItems.length) {
      activeItems.forEach((activeItem) => {
        activeItem.classList.remove('active');
        activeItem.setAttribute('aria-hidden', true);
      });
    }

    if (!nextPanel) return;

    if ((type === 'mouseenter' || type === 'focus') && !nextPanel.classList.contains('active')) {
      nextPanel.classList.add('active');
      nextPanel.setAttribute('aria-hidden', false);
    }
    if ((type === 'mouseleave' || type === 'blur') && nextPanel.classList.contains('active')) {
      nextPanel.classList.remove('active');
      nextPanel.setAttribute('aria-hidden', true);
    }
  };

  /**
   * Handles keypress when focused on megamenu root element
   * @param {Event} event 
   */
  megaMenuKeypress(event) {
    const keyPressed = getKeypress(event);

    switch(keyPressed) {
      case 'SPACE':
        if (!this.megaMenu.classList.contains('active')) {
          this.megaMenuOpen(this.megaMenu, this.itemLists);
        } else {
          this.megaMenuClose(this.megaMenu, this.itemLists);
        }
        break;
      case 'ESC':
        if (this.megaMenu.classList.contains('active')) {
          this.megaMenuClose(this.megaMenu, this.itemLists);
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
    const { currentTarget } = event;
    const keyPressed = getKeypress(event);
    const currentItem = currentTarget.closest('.megamenu__item');

    switch (keyPressed) {
      case 'UP':
        this.focusPrevOfCurrent(currentItem);
        break;
      case 'DOWN':
        this.focusNextOfCurrent(currentItem);
        break;
      case 'RIGHT':
        this.focusChildOfCurrent(currentItem);
        break;
      case 'LEFT':
        this.focusParentOfCurrent(currentItem);
        break;
      case 'SPACE':
        this.focusChildOfCurrent(currentItem);
        break;
      case 'ESC':
        this.megaMenuClose(this.megaMenu, this.itemLists);
        break;
      case 'HOME':
        this.focusFirstOfCurrent(currentItem);
        break;
      case 'END' :
        this.focusLastOfCurrent(currentItem);
        break;
    }
  };

  /**
   * Returns user to previous menu list
   * @param {Event} event 
   */
  handleBackButton(event) {
    const { currentTarget } = event;
    const parentList = currentTarget.closest('.megamenu__items');

    parentList.classList.remove('active');
    parentList.setAttribute('aria-hidden', true);

    if (parentList.parentElement === this.megaMenu) {
      this.megaMenu.classList.remove('active');
      this.megaMenu.setAttribute('aria-hidden', true);
    }
  }

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
