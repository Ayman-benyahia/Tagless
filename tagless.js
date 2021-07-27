class Node {

    constructor(name, value) {
        this.value = value;
        this.name = name;
        this.parent = null;
        this.prev = null;
        this.next = null;
        this.children = [];
    }

    addChild(node) {
        if (node === null || typeof node === "undefined") return;
        node.parent = this;
        this.children.push(node);
        for (let i = 0; i < this.children.length; i++) {
            if (typeof this.children[i + 1] !== "undefined") {
                this.children[i].next = this.children[i + 1];
            }
            if (typeof this.children[i - 1] !== "undefined") {
                this.children[i].prev = this.children[i - 1];
            }
        }
    }
}

function construct(tree) {
    let code = '';
    if (typeof tree === "undefined" || tree === null || typeof tree.children.length <= 0) return code;
    for (let i = 0; i < tree.children.length; i++) {
        code += tree.children[i].value;
        code += construct(tree.children[i]);
    }
    return code;
}

function interpret(tree) {
    if (typeof tree === "undefined" || tree === null) return null;

    if (tree.name === 'special' && tree.value === ')') {
        tree.value = '>';
        return;
    }

    if (tree.name === 'special' && tree.value === '(') {
        tree.value = ' ';
        tree.name = 'space';
        return;
    }

    if (tree.name === 'close-tag') {
        tree.children.splice(0, 0, new Node('special', '<'));
        tree.children.push(new Node('special', '>'));
        return;
    }

    if (tree.name === 'open-tag') {
        tree.children.splice(0, 0, new Node('special', '<'));
        return;
    }

    if (tree.name === 'special' && tree.value === '!' && tree.parent.children[0].value !== '<') {
        tree.parent.children.splice(0, 0, new Node('special', '<'));
        let dashCount = 0;
        for (let i = 0; i < tree.parent.children.length; i++) {
            if (dashCount === 4);
            if (tree.parent.children[i].name === 'special' &&
                tree.parent.children[i].value === '-') {
                dashCount++;
                if (dashCount === 4) {
                    tree.parent.children.splice(i + 1, 0, new Node('special', '>'));
                    break;
                }
            }
        }
        return;
    }

    if (tree.name === 'text') {
        tree.value = tree.value.replace(/\@\'/g, '\'');
        return;
    }

    if (tree.name === 'special' && tree.value === ':') {
        tree.name = 'special';
        tree.value = '=';
        for (let i = 0; i < tree.parent.children.length; i++) {
            if (i <= 0 || i >= tree.parent.children.length - 1) continue;
            if (tree.parent.children[i - 1].name === 'space' && tree.parent.children[i].value === '=') {
                tree.parent.children[i - 1].value = '';
                tree.parent.children[i - 1].children = [];
            }
            if (tree.parent.children[i + 1].name === 'space' && tree.parent.children[i].value === '=') {
                tree.parent.children[i + 1].value = '';
                tree.parent.children[i + 1].children = [];
            }
        }
        return;
    }

    if (tree.name === 'special' && tree.value === `'`) {
        tree.name = 'special';
        tree.value = `"`;
        return;
    }

    if (tree.name === 'special' && tree.value === `'` && tree.parent.name === 'inner') {
        tree.name = 'space';
        tree.value = ``;
        return;
    }

    if (tree.name === 'special' && tree.value === ':') {
        tree.name = 'space';
        tree.value = '';
        return;
    }

    for (let i = 0; i < tree.children.length; i++) {
        interpret(tree.children[i]);
    }

    if (tree.parent === null) {
        return construct(tree);
    }
}

let parse = (code) => {

    let index = -1;
    let lookAhead = '';
    let linesCount = 0;

    function match(char) {
        if (code[index + 1] === '\n') { linesCount++; }
        if (char === code[index + 1]) { index++; lookAhead = code[index]; }
        else { throwError(char); }
    }

    function throwError(char) {
        throw "Syntax error at line: `" + linesCount + "`" +
        ", missing token `" + char + "`";
    }

    function element() {
        let node = new Node('element', '');
        node.addChild(space());
        if (code[index + 1] === '!') {
            node.addChild(new Node('special', '!')); match('!');
            node.addChild(new Node('special', '-')); match('-');
            node.addChild(new Node('special', '-')); match('-');
            node.addChild(text());
            node.addChild(new Node('special', '-')); match('-');
            node.addChild(new Node('special', '-')); match('-');
            node.addChild(space());
            node.addChild(inner());
        }
        else if (code[index + 1] === `'`) {
            node.addChild(inner());
        }
        else {
            node.addChild(openTag());
            node.addChild(space());
            node.addChild(new Node('special', '(')); match('(');
            node.addChild(space());
            node.addChild(attribute());
            node.addChild(space());
            node.addChild(new Node('special', ')')); match(')');
            node.addChild(new Node('space', ' ')); match(' ');
            node.addChild(space());
            node.addChild(inner());
            node.addChild(space());
            node.addChild(closeTag());
            node.addChild(space());
            node.addChild(inner());
        }

        return node;
    }

    function openTag() {
        let node = new Node('open-tag', '');

        if (
            isLetter(code[index + 1]) ||
            code[index + 1] === '-' ||
            code[index + 1] === '_'
        ) {
            node.addChild(letter());
            node.addChild(name());
        }

        return node;
    }

    function closeTag() {
        let node = new Node('close-tag', '');
        node.addChild(new Node('special', '/')); match('/');

        if (
            isLetter(code[index + 1]) ||
            code[index + 1] === '-' ||
            code[index + 1] === '_'
        ) {
            node.addChild(letter());
            node.addChild(name());
        }

        return node;
    }

    function attribute() {
        let node = new Node('attr', '');
        if (code[index + 1] === ')') return node;

        node.addChild(attributeName());
        node.addChild(space());
        node.addChild(new Node('special', ':')); match(':');
        node.addChild(space());
        node.addChild(new Node('special', `'`)); match(`'`);
        node.addChild(text());
        node.addChild(new Node('special', `'`)); match(`'`);
        node.addChild(space());

        if (isLetter(code[index + 1])) {
            node.addChild(attribute());
        }

        return node;
    }

    function attributeName() {
        let node = new Node('attr-name', '');
        node.addChild(letter());

        if (
            isLetter(code[index + 1]) ||
            code[index + 1] === '-' ||
            code[index + 1] === '_'
        ) {
            node.addChild(attributeName());
        }

        return node;
    }

    function inner() {
        let node = new Node('inner', '');
        if (code[index + 1] === `'`) {
            node.addChild(new Node('special', `'`)); match(`'`);
            node.addChild(text());
            node.addChild(new Node('special', `'`)); match(`'`);
            node.addChild(space());
            node.addChild(inner());
        }
        else if (
            isLetter(code[index + 1]) ||
            code[index + 1] === '!'
        ) {
            node.addChild(element());
            node.addChild(inner());
        }

        return node;
    }

    function text() {
        let node = new Node('text', '');
        for (let i = index + 1; i < code.length; i++) {
            if (code[i] === `'` && code[i - 1] !== `@`) break;
            if (code[i] === `-` && code[i + 1] === `-` && code[index - 2] !== '@') break;
            node.value += code[i];
            match(code[i]);
        }
        return node;
    }

    function name() {
        let node = new Node('name', '');
        if (isLetter(code[index + 1]) &&
            (isLetter(code[index + 2]) ||
                isDigit(code[index + 2]) ||
                code[index + 2] === '-' ||
                code[index + 2] === '_')) {

            node.addChild(letter());
            node.addChild(name());
        }
        else if (isDigit(code[index + 1]) &&
            (isLetter(code[index + 2]) ||
                isDigit(code[index + 2]) ||
                code[index + 2] === '-' ||
                code[index + 2] === '_')) {

            node.addChild(digit());
            node.addChild(name());
        }
        else if (code[index + 1] === '-' &&
            (isLetter(code[index + 2]) ||
                isDigit(code[index + 2]) ||
                code[index + 2] === '-' ||
                code[index + 2] === '_')) {

            node = new Node('special', '-');
            node.addChild(name());
        }
        else if (code[index + 1] === '_' &&
            (isLetter(code[index + 2]) ||
                isDigit(code[index + 2]) ||
                code[index + 2] === '-' ||
                code[index + 2] === '_')) {

            node.addChild(new Node('special', '-'));
            node.addChild(name());
        }
        else if (isLetter(code[index + 1])) {
            node = letter();
        }
        else if (isDigit(code[index + 1])) {
            node.addChild(digit());
        }
        else if (code[index + 1] === '-') {
            node.addChild(new Node('special', '-'));
        }
        else if (code[index + 1] === '_') {
            node.addChild(new Node('special', '_'));
        }

        return node;
    }

    function letter() {
        let node = null;
        if (isLetter(code[index + 1])) {
            node = new Node('letter', code[index + 1]);
            match(code[index + 1]);
        }
        else { throwError(lookAhead); }
        return node;
    }

    function digit() {
        let node = null;
        if (isDigit(code[index + 1])) {
            node = new Node('digit', code[index + 1]);
            match(code[index + 1]);
        }
        else { throwError(lookAhead); }
        return node;
    }

    function special() {
        let node = null;
        if (isSpecial(code[index + 1])) {
            node = new Node('special', code[index + 1]);
            match(code[index + 1]);
        }
        else { throwError(lookAhead); }
        return node;
    }

    function space() {
        let node = null;
        if (code[index + 1] === ' ' && (code[index + 2] === ' ' || code[index + 2] === '\n')) {
            node = new Node('space', ' '); match(' ');
            node.addChild(space());
        }
        if (code[index + 1] === '\n' && (code[index + 2] === ' ' || code[index + 2] === '\n')) {
            node = new Node('space', '\n'); match('\n');
            node.addChild(space());
        }
        else if (code[index + 1] === ' ') {
            node = new Node('space', ' ');
            match(' ');
        }
        else if (code[index + 1] === '\n') {
            node = new Node('space', '\n');
            match('\n');
        }

        return node;
    }

    function isLetter(ch) {
        let letters = 'abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        if (!letters.includes(ch)) return false;
        else return true;
    }

    function isDigit(ch) {
        let digits = '0123456789'.split('');
        if (!digits.includes(ch)) return false;
        return true;
    }

    function isSpecial(ch) {
        let specials = '!#$%&"()*+,-./:;<=>\'?@[\\]^_`{|}~'.split('');
        if (!specials.includes(ch)) return false;
        return true;
    }

    let tree = element();
    return interpret(tree);
}

