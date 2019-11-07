'use babel';

import GenerateGUID from '../lib/generate-g-u-i-d';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('GenerateGUID', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('generate-g-u-i-d');
  });

  describe('when the generate-g-u-i-d:generate event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.generate-g-u-i-d')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'generate-g-u-i-d:generate');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.generate-g-u-i-d')).toExist();

        let generateGUIDElement = workspaceElement.querySelector('.generate-g-u-i-d');
        expect(generateGUIDElement).toExist();

        let generateGUIDPanel = atom.workspace.panelForItem(generateGUIDElement);
        expect(generateGUIDPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'generate-g-u-i-d:generate');
        expect(generateGUIDPanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.generate-g-u-i-d')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'generate-g-u-i-d:generate');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let generateGUIDElement = workspaceElement.querySelector('.generate-g-u-i-d');
        expect(generateGUIDElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'generate-g-u-i-d:generate');
        expect(generateGUIDElement).not.toBeVisible();
      });
    });
  });
});
