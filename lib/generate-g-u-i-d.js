'use babel';

import { CompositeDisposable, Point, TextEditor } from 'atom';

export default {
    activate() {
        this.subscriptions = new CompositeDisposable();

        this.miniEditor = new TextEditor({ mini: true });
        this.miniEditor.element.addEventListener('blur', this.close.bind(this));

        this.message = document.createElement('div');
        this.message.textContent = "How many GUIDs do you need? Enter a number";
        this.message.classList.add('message');

        this.element = document.createElement('div');
        this.element.classList.add('generate-g-u-i-d');
        this.element.appendChild(this.miniEditor.element);
        this.element.appendChild(this.message);

        this.modalPanel = atom.workspace.addModalPanel({
            item: this.element,
            visible: true
        });
        this.toggle();

        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'generate-g-u-i-d:generate': () => this.toggle()
        }));

        atom.commands.add(this.miniEditor.element, 'core:confirm', () => {
            let amount = parseInt(this.miniEditor.getText(), 10);
            this.generate(amount);
        });
        atom.commands.add(this.miniEditor.element, 'core:cancel', () => {
            this.close();
        });
        this.miniEditor.onWillInsertText(arg => {
            if (arg.text.match(/[^0-9:]/)) {
                arg.cancel();
            }
        });
    },

    deactivate() {
        this.modalPanel.destroy();
        this.subscriptions.dispose();
        this.generateGUIDView.destroy();
    },

    serialize() {
        return {
            generateGUIDViewState: this.generateGUIDView.serialize()
        };
    },

    toggle() {
        if (this.modalPanel.isVisible() || !atom.workspace.getActiveTextEditor()) {
            this.close();
        } else {
            this.open();
        }
    },
    open() {
        this.storeFocusedElement();
        this.modalPanel.show();
        this.miniEditor.element.focus();
    },
    close() {
        if (!this.modalPanel.isVisible()) return;
        this.miniEditor.setText('');
        this.modalPanel.hide();
        if (this.miniEditor.element.hasFocus()) {
            this.restoreFocus();
        }
    },

    storeFocusedElement() {
        this.previouslyFocusedElement = document.activeElement;
        return this.previouslyFocusedElement;
    },
    restoreFocus() {
        if (
            this.previouslyFocusedElement &&
            this.previouslyFocusedElement.parentElement
        ) {
            return this.previouslyFocusedElement.focus();
        }
        atom.views.getView(atom.workspace).focus();
    },

    generate(amount) {
        let editor
        if (editor = atom.workspace.getActiveTextEditor()) {
            let guidsString = "";

            for (let i = 0; i < amount; i++) {
                let guid = this.generateGUID();
                i == amount - 1 ? guidsString += guid : guidsString += guid + "\n";
            }
            editor.insertText(guidsString);
            this.close();
        }
    },
    generateGUID() {
        var msTime = (performance && performance.now && (performance.now()*1000)) || 0 //Time in microseconds
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16; //random number between 0 and 16
            r = (msTime + r)%16 | 0;
            msTime = Math.floor(msTime/16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
       });
    }
};
