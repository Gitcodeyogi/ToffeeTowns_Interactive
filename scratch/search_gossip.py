with open(r"c:\Yogesh Universe\TOFFEETOWNS_FUN\scratch\clean_f_016807.js", 'r', encoding='utf-8') as f:
    content = f.read()

pos = 101724
start = pos
end = min(len(content), pos + 1000)
print(content[start:end])
