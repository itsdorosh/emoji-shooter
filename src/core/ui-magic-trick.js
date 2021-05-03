export class UiMagicTrick {

  static registerElements(elementInitializers) {
    UiMagicTrick.registeredElements = elementInitializers.map((elementInitializer) => {
      const element = document.getElementById(elementInitializer.id);
      if (elementInitializer.onclick) element.addEventListener('click', elementInitializer.onclick);
      if (!elementInitializer.visible) UiMagicTrick.hide(element);
      return {id: elementInitializer.id, element};
    });
  }

  static createState(name, state = {}) {
    UiMagicTrick.states[name] = state;
  }

  static switchState(name) {
    if(!UiMagicTrick.states[name]) { throw new Error('Not initialized state'); }
    UiMagicTrick.activeState = UiMagicTrick.states[name];
    UiMagicTrick.renderActiveState();
  }

  static renderActiveState() {
    UiMagicTrick.registeredElements
      .filter((registeredElement) => registeredElement.id in UiMagicTrick.activeState)
      .forEach((activeElement) => UiMagicTrick.activeState[activeElement.id]
        ? UiMagicTrick.show(activeElement.element)
        : UiMagicTrick.hide(activeElement.element)
      );
  }

  static hide(element) {
    element.classList.add('hidden');
  }

  static show(element) {
    element.classList.remove('hidden');
  }
}
UiMagicTrick.registeredElements = [];
UiMagicTrick.states = {};
UiMagicTrick.activeState = null;
