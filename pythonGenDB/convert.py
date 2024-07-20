import json
import pinyin

res = []

def splitPinyins(pinyins):
    res = [pinyin[:-1] if pinyin[-1].isdigit() else pinyin for pinyin in pinyins.split('/')]
    return list(dict.fromkeys(res))

def pinyinStrip(pinyin):
    res = ''
    for c in pinyin:
        if not c.isdigit():
            res += c
    return res

def readCharacters():
    with open('frequency.txt') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split('\t')
            try:
                ch = parts[1]
                freq = parts[2]
                pinyins = parts[4]
                for pinyin in splitPinyins(pinyins):
                    # print(pinyin, ch, freq)
                    res.append([pinyin, ch])
            except Exception as err:
                pass
                # print(err)
                # print(line, parts)

def readWords():
    with open('words.txt') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue

            parts = line.split('\t')
            word = parts[1]
            py = pinyin.get(word, format="numerical")
            py = pinyinStrip(py)
            # print(word, py)
            res.append([py, word])


readCharacters()
readWords()
print(json.dumps(res, ensure_ascii=False))