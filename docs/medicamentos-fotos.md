# Documentacao - baixar fotos por EAN e atualizar planilha

Este guia descreve exatamente o que foi feito para:
- buscar fotos na Internet por EAN (320px a 1500px, priorizando a faixa media),
- salvar em `medicamentos/fotos` com nome `<EAN>.jpeg`,
- preencher a coluna `urlFoto` da planilha com o nome do arquivo.

## Requisitos
- macOS com `sips` disponivel (ja vem instalado).
- `python3` instalado.
- Acesso a internet.
- OCR via `tesseract` para validar texto da embalagem.
- (Opcional) `opencv-python` para detectar pessoas e evitar fotos com modelos.

Fontes usadas para imagens:
- OpenFoodFacts (world/br)
- UPCItemDB (trial)
- DuckDuckGo Images (fallback)

## Estrutura esperada
- `medicamentos/Lista-produtos-fotos.xlsx` (planilha original)
- `medicamentos/fotos/` (pasta onde as imagens serao salvas)

## Regras de validacao de foto
- Resolucao aceita: minimo 320px e maximo 1500px (lado maior).
- Priorizar a faixa media (ex.: ~900px no lado maior).
- Validar via OCR se a `DESCRICAO` aparece na imagem (coluna A, case-insensitive). Se nao aparecer, tentar outra foto.
- Evitar fotos com pessoas ou outros produtos que nao sejam somente o produto da `DESCRICAO`.

## Passo 1 - Criar pastas
```bash
mkdir -p medicamentos/fotos
```

## Passo 2 - Baixar imagens (320px a 1500px)
Salve o script abaixo em `scripts/baixar_fotos_ean.py` (ou rode direto via `python3 - <<'PY'`).

```python
import json
import os
import re
import subprocess
import tempfile
import time
import urllib.parse
import urllib.request
import zipfile
import xml.etree.ElementTree as ET
from collections import defaultdict
from decimal import Decimal, InvalidOperation

XLSX_PATH = 'medicamentos/Lista-produtos-fotos.xlsx'
OUT_DIR = 'medicamentos/fotos'
RESULT_PATH = os.path.join(OUT_DIR, 'download_results.json')

os.makedirs(OUT_DIR, exist_ok=True)

UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
MIN_PX = 320
MAX_PX = 1500
TARGET_PX = 900
OCR_LANG = 'por+eng'

try:
    import cv2
except Exception:
    cv2 = None

def col_to_index(col):
    idx = 0
    for c in col:
        idx = idx * 26 + (ord(c) - ord('A') + 1)
    return idx - 1

def normalize_ean(value):
    s = str(value).strip()
    if not s:
        return ''
    try:
        if re.match(r'^[0-9.]+(E[+-]?\\d+)?$', s, re.I):
            d = Decimal(s)
            s = format(d, 'f')
        if '.' in s:
            s = s.rstrip('0').rstrip('.')
    except InvalidOperation:
        pass
    s = re.sub(r'\\D', '', s)
    return s

def read_sheet_rows(path):
    with zipfile.ZipFile(path) as z:
        shared_strings = []
        try:
            with z.open('xl/sharedStrings.xml') as f:
                root = ET.parse(f).getroot()
                ns = {'ns': root.tag.split('}')[0].strip('{')} if '}' in root.tag else {}
                for si in root.findall('.//ns:si' if ns else './/si', ns):
                    texts = [t.text or '' for t in si.findall('.//ns:t' if ns else './/t', ns)]
                    shared_strings.append(''.join(texts))
        except KeyError:
            pass

        with z.open('xl/worksheets/sheet1.xml') as f:
            root = ET.parse(f).getroot()
            ns = {'ns': root.tag.split('}')[0].strip('{')} if '}' in root.tag else {}
            rows = defaultdict(dict)
            for row in root.findall('.//ns:row' if ns else './/row', ns):
                row_num = int(row.attrib.get('r', '0'))
                for c in row.findall('ns:c' if ns else 'c', ns):
                    r = c.attrib.get('r')
                    if not r:
                        continue
                    m = re.match(r'([A-Z]+)(\\d+)', r)
                    if not m:
                        continue
                    col_letters, _ = m.groups()
                    col_idx = col_to_index(col_letters)

                    t = c.attrib.get('t')
                    v_elem = c.find('ns:v' if ns else 'v', ns)
                    value = ''
                    if t == 's':
                        if v_elem is not None and v_elem.text is not None:
                            idx = int(v_elem.text)
                            value = shared_strings[idx] if idx < len(shared_strings) else ''
                    elif t == 'inlineStr':
                        is_elem = c.find('ns:is' if ns else 'is', ns)
                        if is_elem is not None:
                            t_elem = is_elem.find('ns:t' if ns else 't', ns)
                            value = t_elem.text if t_elem is not None else ''
                    else:
                        value = v_elem.text if v_elem is not None and v_elem.text is not None else ''

                    rows[row_num][col_idx] = value

    return rows

def fetch_text(url, headers=None):
    headers = headers or {}
    if 'User-Agent' not in headers:
        headers['User-Agent'] = UA
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=25) as resp:
        return resp.read().decode('utf-8', errors='ignore')

def fetch_json(url, headers=None):
    return json.loads(fetch_text(url, headers=headers))

def collect_urls(obj, out):
    if isinstance(obj, str):
        if obj.startswith('http'):
            out.append(obj)
        return
    if isinstance(obj, dict):
        for v in obj.values():
            collect_urls(v, out)
        return
    if isinstance(obj, list):
        for v in obj:
            collect_urls(v, out)

def unique_urls(urls):
    seen = set()
    out = []
    for u in urls:
        if u and u not in seen:
            seen.add(u)
            out.append(u)
    return out

def openfoodfacts_urls(ean):
    urls = []
    for base in ['https://world.openfoodfacts.org', 'https://br.openfoodfacts.org']:
        try:
            data = fetch_json(f'{base}/api/v0/product/{ean}.json')
        except Exception:
            continue
        if data.get('status') != 1:
            continue
        product = data.get('product', {})
        for key in [
            'image_url', 'image_front_url', 'image_small_url', 'image_thumb_url',
            'image_front_small_url', 'image_front_thumb_url'
        ]:
            if product.get(key):
                urls.append(product[key])
        collect_urls(product.get('selected_images', {}), urls)
        break
    return unique_urls(urls)

def upcitemdb_urls(ean):
    urls = []
    try:
        data = fetch_json(f'https://api.upcitemdb.com/prod/trial/lookup?upc={ean}')
    except Exception:
        return []
    if data.get('code') != 'OK':
        return []
    for item in data.get('items', []):
        urls.extend(item.get('images', []) or [])
    return unique_urls(urls)

def duckduckgo_image_candidates(query):
    q = urllib.parse.quote(query)
    try:
        html = fetch_text(
            f'https://duckduckgo.com/?q={q}&iax=images&ia=images',
            headers={'User-Agent': UA},
        )
    except Exception:
        return []

    m = re.search(r\"vqd='([^']+)'\", html)
    if not m:
        m = re.search(r'vqd=\\\"([^\\\"]+)\\\"', html)
    if not m:
        return []
    vqd = m.group(1)

    params = {
        'l': 'us-en',
        'o': 'json',
        'q': query,
        'vqd': vqd,
        'f': ',,,',
        'p': '1',
    }
    url = f\"https://duckduckgo.com/i.js?{urllib.parse.urlencode(params)}\"

    try:
        data = fetch_json(
            url,
            headers={
                'User-Agent': UA,
                'Referer': 'https://duckduckgo.com/',
            },
        )
    except Exception:
        return []

    candidates = []
    for item in data.get('results', []) or []:
        img = item.get('image')
        if not img:
            continue
        try:
            w = int(item.get('width') or 0)
            h = int(item.get('height') or 0)
        except ValueError:
            w = 0
            h = 0
        candidates.append({'url': img, 'width': w, 'height': h})
    return candidates

def get_image_size(path):
    try:
        out = subprocess.check_output(
            ['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', path],
            text=True,
            stderr=subprocess.STDOUT,
        )
    except Exception:
        return None, None

    width = None
    height = None
    for line in out.splitlines():
        line = line.strip()
        if line.startswith('pixelWidth:'):
            try:
                width = int(line.split(':', 1)[1].strip())
            except ValueError:
                pass
        elif line.startswith('pixelHeight:'):
            try:
                height = int(line.split(':', 1)[1].strip())
            except ValueError:
                pass
    return width, height

def resize_if_needed(path):
    w, h = get_image_size(path)
    if not w or not h:
        return
    size = max(w, h)
    if size <= MAX_PX:
        return
    subprocess.check_call(
        ['sips', '-Z', str(MAX_PX), path],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

def download_url(url, tmp_path):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
    with open(tmp_path, 'wb') as f:
        f.write(data)

def normalize_text(s):
    s = s.lower()
    s = re.sub(r'[^a-z0-9\\s]+', ' ', s)
    s = re.sub(r'\\s+', ' ', s).strip()
    return s

def ocr_text(path):
    try:
        out = subprocess.check_output(
            ['tesseract', path, 'stdout', '-l', OCR_LANG],
            text=True,
            stderr=subprocess.DEVNULL,
        )
        return normalize_text(out)
    except Exception:
        return ''

def descricao_matches(ocr, descricao):
    if not descricao:
        return True
    desc = normalize_text(descricao)
    if not desc:
        return True
    desc_tokens = [t for t in desc.split(' ') if len(t) >= 3]
    if not desc_tokens:
        return True
    hits = sum(1 for t in desc_tokens if t in ocr)
    if len(desc_tokens) <= 3:
        return hits >= 1
    return hits >= 2

def has_people(path):
    if cv2 is None:
        return False
    try:
        img = cv2.imread(path)
        if img is None:
            return False
        hog = cv2.HOGDescriptor()
        hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())
        rects, _ = hog.detectMultiScale(img, winStride=(8, 8))
        return len(rects) > 0
    except Exception:
        return False

def pick_and_save_image(ean, descricao, existing):
    dest = os.path.join(OUT_DIR, f'{ean}.jpeg')
    if dest in existing:
        return dest, 'existing'

    candidates = []
    candidates.extend(openfoodfacts_urls(ean))
    candidates.extend(upcitemdb_urls(ean))

    if not candidates:
        ddg = duckduckgo_image_candidates(ean)
        candidates.extend([c['url'] for c in ddg])

    if not candidates and descricao:
        ddg = duckduckgo_image_candidates(f'{ean} {descricao}')
        candidates.extend([c['url'] for c in ddg])

    candidates = unique_urls(candidates)
    candidates = candidates[:12]

    best_tmp = None
    best_score = None
    best_url = None

    for url in candidates:
        tmp_fd, tmp_path = tempfile.mkstemp(prefix=f'tmp_{ean}_', dir=OUT_DIR)
        os.close(tmp_fd)
        try:
            download_url(url, tmp_path)
            w, h = get_image_size(tmp_path)
            if not w or not h:
                raise ValueError('invalid image')
            size = max(w, h)
            if size < MIN_PX:
                os.remove(tmp_path)
                continue

            resize_if_needed(tmp_path)
            ocr = ocr_text(tmp_path)
            if not descricao_matches(ocr, descricao):
                os.remove(tmp_path)
                continue
            if has_people(tmp_path):
                os.remove(tmp_path)
                continue

            size = max(get_image_size(tmp_path))
            score = abs(min(size, MAX_PX) - TARGET_PX)
            if best_score is None or score < best_score:
                if best_tmp and os.path.exists(best_tmp):
                    os.remove(best_tmp)
                best_tmp = tmp_path
                best_score = score
                best_url = url
            else:
                os.remove(tmp_path)
        except Exception:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
            continue

    if not best_tmp:
        return None, None

    try:
        subprocess.check_call(
            ['sips', '-s', 'format', 'jpeg', best_tmp, '--out', dest],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
    except Exception:
        if os.path.exists(best_tmp):
            os.remove(best_tmp)
        if os.path.exists(dest):
            os.remove(dest)
        return None, None

    if os.path.exists(best_tmp):
        os.remove(best_tmp)

    return dest, best_url

# limpeza de temporarios
for name in os.listdir(OUT_DIR):
    if name.startswith('tmp_'):
        try:
            os.remove(os.path.join(OUT_DIR, name))
        except Exception:
            pass

rows = read_sheet_rows(XLSX_PATH)
row_entries = []
for r in sorted(rows.keys()):
    if r == 1:
        continue
    desc = rows[r].get(0, '')
    ean_raw = rows[r].get(2, '')
    ean = normalize_ean(ean_raw)
    if ean:
        row_entries.append((ean, desc))

unique = {}
for ean, desc in row_entries:
    unique.setdefault(ean, desc)

unique_eans = sorted(unique.keys())
existing_files = {
    os.path.join(OUT_DIR, f) for f in os.listdir(OUT_DIR) if f.endswith('.jpeg')
}

results = {
    'found': {},
    'missing': [],
    'source': {},
}

for idx, ean in enumerate(unique_eans, 1):
    desc = unique.get(ean, '')
    print(f'[{idx}/{len(unique_eans)}] {ean} ...', flush=True)
    dest, src = pick_and_save_image(ean, desc, existing_files)
    if dest:
        results['found'][ean] = os.path.basename(dest)
        if src:
            results['source'][ean] = src
        print(f'  ok -> {os.path.basename(dest)}', flush=True)
    else:
        results['missing'].append(ean)
        print('  not found', flush=True)
    time.sleep(0.25)

with open(RESULT_PATH, 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=True, indent=2)

print(f'\\nFound: {len(results[\"found\"])} / {len(unique_eans)}', flush=True)
print(f'Missing: {len(results[\"missing\"])}', flush=True)
print(f'Results saved to: {RESULT_PATH}', flush=True)
```

Execute:
```bash
python3 scripts/baixar_fotos_ean.py
```

## Passo 3 - Atualizar a coluna urlFoto
Depois de baixar as imagens, rode o script abaixo para preencher a coluna `urlFoto` com o nome do arquivo (ex.: `7891234567890.jpeg`).

Salve como `scripts/atualizar_urlfoto.py`:

```python
import json
import os
import re
import zipfile
import xml.etree.ElementTree as ET
from decimal import Decimal, InvalidOperation

XLSX_PATH = 'medicamentos/Lista-produtos-fotos.xlsx'
RESULT_PATH = 'medicamentos/fotos/download_results.json'

def col_to_index(col):
    idx = 0
    for c in col:
        idx = idx * 26 + (ord(c) - ord('A') + 1)
    return idx - 1

def normalize_ean(value):
    s = str(value).strip()
    if not s:
        return ''
    try:
        if re.match(r'^[0-9.]+(E[+-]?\\d+)?$', s, re.I):
            d = Decimal(s)
            s = format(d, 'f')
        if '.' in s:
            s = s.rstrip('0').rstrip('.')
    except InvalidOperation:
        pass
    s = re.sub(r'\\D', '', s)
    return s

def read_shared_strings(z):
    try:
        with z.open('xl/sharedStrings.xml') as f:
            root = ET.parse(f).getroot()
            ns = {'ns': root.tag.split('}')[0].strip('{')} if '}' in root.tag else {}
            out = []
            for si in root.findall('.//ns:si' if ns else './/si', ns):
                texts = [t.text or '' for t in si.findall('.//ns:t' if ns else './/t', ns)]
                out.append(''.join(texts))
            return out
    except KeyError:
        return []

def get_cell_value(cell, shared_strings, ns):
    t = cell.attrib.get('t')
    v_elem = cell.find('ns:v' if ns else 'v', ns)
    if t == 's':
        if v_elem is not None and v_elem.text is not None:
            idx = int(v_elem.text)
            return shared_strings[idx] if idx < len(shared_strings) else ''
        return ''
    if t == 'inlineStr':
        is_elem = cell.find('ns:is' if ns else 'is', ns)
        if is_elem is not None:
            t_elem = is_elem.find('ns:t' if ns else 't', ns)
            return t_elem.text if t_elem is not None else ''
        return ''
    return v_elem.text if v_elem is not None and v_elem.text is not None else ''

def cell_col_idx(cell):
    r = cell.attrib.get('r', '')
    m = re.match(r'([A-Z]+)', r)
    if not m:
        return 0
    return col_to_index(m.group(1))

with open(RESULT_PATH, 'r', encoding='utf-8') as f:
    results = json.load(f)

found = results.get('found', {})

with zipfile.ZipFile(XLSX_PATH) as zin:
    shared_strings = read_shared_strings(zin)
    with zin.open('xl/worksheets/sheet1.xml') as f:
        tree = ET.parse(f)

root = tree.getroot()
ns_uri = root.tag.split('}')[0].strip('{') if '}' in root.tag else ''
ns = {'ns': ns_uri} if ns_uri else {}

def q(tag):
    return f'{{{ns_uri}}}{tag}' if ns_uri else tag

updated = 0
missing_rows = 0

for row in root.findall('.//ns:row' if ns else './/row', ns):
    row_num = int(row.attrib.get('r', '0'))
    if row_num == 1:
        continue

    ean_val = ''
    for cell in row.findall('ns:c' if ns else 'c', ns):
        r = cell.attrib.get('r', '')
        if r.startswith('C'):
            ean_val = get_cell_value(cell, shared_strings, ns)
            break

    ean = normalize_ean(ean_val)
    if not ean:
        continue

    filename = found.get(ean)
    if not filename:
        missing_rows += 1
        continue

    target_ref = f'E{row_num}'
    target_idx = col_to_index('E')
    target_cell = None

    for cell in row.findall('ns:c' if ns else 'c', ns):
        if cell.attrib.get('r') == target_ref:
            target_cell = cell
            break

    if target_cell is None:
        target_cell = ET.Element(q('c'), {'r': target_ref, 't': 'inlineStr'})
        inserted = False
        for i, cell in enumerate(list(row)):
            if cell_col_idx(cell) > target_idx:
                row.insert(i, target_cell)
                inserted = True
                break
        if not inserted:
            row.append(target_cell)
    else:
        target_cell.attrib['t'] = 'inlineStr'
        for child in list(target_cell):
            target_cell.remove(child)

    is_elem = ET.SubElement(target_cell, q('is'))
    t_elem = ET.SubElement(is_elem, q('t'))
    t_elem.text = filename
    updated += 1

new_xml = ET.tostring(root, encoding='utf-8', xml_declaration=True)

tmp = XLSX_PATH + '.tmp'
with zipfile.ZipFile(XLSX_PATH) as zin, zipfile.ZipFile(tmp, 'w') as zout:
    for item in zin.infolist():
        if item.filename == 'xl/worksheets/sheet1.xml':
            zout.writestr(item, new_xml)
        else:
            zout.writestr(item, zin.read(item.filename))

os.replace(tmp, XLSX_PATH)

print(f'Updated rows: {updated}')
print(f'Rows without image: {missing_rows}')
```

Execute:
```bash
python3 scripts/atualizar_urlfoto.py
```

## Saidas
- `medicamentos/fotos/<EAN>.jpeg`
- `medicamentos/fotos/download_results.json` com `found`, `missing` e `source`.
- `medicamentos/Lista-produtos-fotos.xlsx` atualizado (coluna `urlFoto`).

## Observacoes
- Se nao estiver no macOS, substitua as chamadas do `sips` por ImageMagick (`identify`/`convert`) ou use `Pillow`.
- Se quiser outro limite de resolucao, altere `MIN_PX`, `MAX_PX` e `TARGET_PX`.
- Se quiser guardar a URL original (em vez do nome do arquivo), ajuste o script de atualizacao.
- Se `opencv-python` nao estiver instalado, o script pula a deteccao de pessoas. Para ativar: `pip install opencv-python`.
- O OCR depende do `tesseract`. No macOS: `brew install tesseract`.
