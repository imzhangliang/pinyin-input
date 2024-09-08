
class TrieNode {
    constructor() {
        this.children = {};
        this.pinyin = null;
        this._chineseCharacters = [];
    }

    get chineseCharacters() {
        return this._chineseCharacters;
    }

    addCharacter(character) {
        this._chineseCharacters.push(character);
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    addWord(pinyin, chineseCharacter) {
        let node = this.root;
        for (let i = 0; i < pinyin.length; i++) {
            let ch = pinyin.charAt(i);
            if (!node.children[ch]) {
                node.children[ch] = new TrieNode();
            }
            node = node.children[ch];
        }

        node.pinyin = pinyin;
        node.addCharacter(chineseCharacter);
    }

    allCharacters(pinyin) {
        if (!pinyin) {
            return [];
        }
        let node = this.root;
        for (let i = 0; i < pinyin.length; i++) {
            let ch = pinyin.charAt(i);
            if (!node.children[ch]) {
                return [];
            }
            node = node.children[ch];
        }

        return node.chineseCharacters;
    }

    allPrefixCharacters(prefix) {
        if (!prefix) {
            return [];
        }
        let node = this.root;
        for (let i = 0; i < prefix.length; i++) {
            let ch = prefix.charAt(i);
            if (!node.children[ch]) {
                return [];
            }
            node = node.children[ch];
        }

        return this.dfsAllCharacters(node);
    }

    dfsAllCharacters(node) {
        let res = [];
        if (node.pinyin) {
            res = res.concat(node.chineseCharacters)
        }

        for (let ch of Object.keys(node.children)) {
            res = res.concat(this.dfsAllCharacters(node.children[ch]));
        }

        return res;
    }

}

let trie = new Trie();

function showPinyinResults(results) {
    document.querySelector("#results").innerHTML = results.map((item, index) => `${index + 1}. ${item}`).join(', ')
}

function getSearchResults(pinyin) {
    // return trie.allPrefixCharacters(pinyin);
    return trie.allCharacters(pinyin);
}

function addWordToContent(word) {
    const contentElem = document.querySelector("#pyInput");
    contentElem.value += word;
}

function getChooseNumberFromPinyin(pinyin) {
    if (!pinyin) {
        return -1;
    }
    const lastChar = pinyin[pinyin.length - 1];
    if (lastChar >= '1' && lastChar <= '9') {
        return Number.parseInt(lastChar);
    } else if (lastChar === ' ') {
        return 1;
    }

    return -1;
}

function loadInputListener() {
    const inputElem = document.querySelector("#pyInput");
    
    inputElem.addEventListener('input', (event) => {
        let pinyin = event.target.value;
        const pinyinReg = /[A-Za-z]+[1-9 ]{0,1}$/;

        pinyin = pinyin.match(pinyinReg)?.[0] || '';
        let chooseNumber = getChooseNumberFromPinyin(pinyin);
        pinyin = pinyin.replace(/[1-9 ]/g, '');

        let results = getSearchResults(pinyin);
        if (chooseNumber !== null && results[chooseNumber - 1]) {
            console.log('add word...')

            inputElem.value = inputElem.value.replace(pinyinReg, '');
            addWordToContent(results[chooseNumber - 1]);
            showPinyinResults([]);
            
        } else {
            showPinyinResults(results);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // URL of the JSON data
    const jsonUrl = 'db.json';

    function loadDBFromJson(jsonDB) {
        jsonDB.forEach(pair => trie.addWord(pair[0], pair[1]));
    }

    // Fetch the JSON data
    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Display the JSON data in the <pre> element
            console.log(data);
            loadDBFromJson(data);
            loadInputListener();
        })
        .catch(error => {
            console.error('Error fetching the JSON data:', error);
            console.error( 'Failed to load data');
        });
});