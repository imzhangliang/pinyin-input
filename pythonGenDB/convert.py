import json
import pinyin

def splitPinyins(pinyins):
    res = [pinyin[:-1] if pinyin[-1].isdigit() else pinyin for pinyin in pinyins.split('/')]
    return list(dict.fromkeys(res))

def pinyinStrip(pinyin):
    res = ''
    for c in pinyin:
        if not c.isdigit():
            res += c
    return res

# Convert an array of chinese characters or words to pinyin library
def wordsToLib(words):
    res = []
    for word in words:
        py = pinyin.get(word, format="numerical")
        py = pinyinStrip(py)
        res.append([py, word])

    return res

if __name__ == '__main__':
    res = []
    words = [line.strip() for line in open('words.txt').read().split('\n') if len(line) > 0]
    res += wordsToLib(words)

    print(json.dumps(res, ensure_ascii=False))
