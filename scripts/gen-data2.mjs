// Generates the remaining dataset files: motherboards, ram, storage, psus, cases, coolers, games, articles, news, reviews, users(builds), comparisons, glossary, authors.
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const outDir = resolve(process.cwd(), 'src/data');
const W = (name, obj) => writeFileSync(resolve(outDir, name), JSON.stringify(obj, null, 1));

// ---------------- motherboards ----------------
const MB = (id, name, brand, socket, chipset, formFactor, memoryType, maxMemoryGB, memSlots, pcieVersion, m2Slots, sataPorts, price, wifi, tier) =>
  ({ id, name, brand, socket, chipset, formFactor, memoryType, maxMemoryGB, memSlots, pcieVersion, m2Slots, sataPorts, price, wifi, tier });

const motherboards = [
  MB('mb-1', 'ASUS ROG Maximus Z790 Hero', 'ASUS', 'LGA 1700', 'Z790', 'ATX', 'DDR5', 192, 4, 'PCIe 5.0', 3, 8, 629, true, 'enthusiast'),
  MB('mb-2', 'MSI MEG Z790 ACE', 'MSI', 'LGA 1700', 'Z790', 'ATX', 'DDR5', 192, 4, 'PCIe 5.0', 4, 8, 699, true, 'enthusiast'),
  MB('mb-3', 'Gigabyte Z790 Aorus Master', 'Gigabyte', 'LGA 1700', 'Z790', 'ATX', 'DDR5', 192, 4, 'PCIe 5.0', 4, 6, 549, true, 'high'),
  MB('mb-4', 'ASRock Z790 Steel Legend WiFi', 'ASRock', 'LGA 1700', 'Z790', 'ATX', 'DDR5', 128, 4, 'PCIe 5.0', 3, 8, 259, true, 'mid'),
  MB('mb-5', 'ASUS TUF Gaming B760-PLUS WiFi', 'ASUS', 'LGA 1700', 'B760', 'ATX', 'DDR5', 128, 4, 'PCIe 4.0', 3, 4, 199, true, 'mid'),
  MB('mb-6', 'MSI PRO B760M-A WiFi', 'MSI', 'LGA 1700', 'B760', 'mATX', 'DDR5', 128, 4, 'PCIe 4.0', 2, 4, 119, true, 'entry'),
  MB('mb-7', 'Gigabyte B760M DS3H DDR4', 'Gigabyte', 'LGA 1700', 'B760', 'mATX', 'DDR4', 128, 4, 'PCIe 4.0', 1, 4, 89, false, 'entry'),
  MB('mb-8', 'ASRock B660M-HDV/M.2', 'ASRock', 'LGA 1700', 'B660', 'mATX', 'DDR4', 128, 2, 'PCIe 4.0', 1, 4, 85, false, 'entry'),
  MB('mb-9', 'ASUS ROG Strix Z690-A Gaming WiFi D4', 'ASUS', 'LGA 1700', 'Z690', 'ATX', 'DDR4', 128, 4, 'PCIe 5.0', 4, 6, 329, true, 'high'),
  MB('mb-10', 'MSI MAG Z690 Tomahawk WiFi DDR4', 'MSI', 'LGA 1700', 'Z690', 'ATX', 'DDR4', 128, 4, 'PCIe 5.0', 4, 8, 289, true, 'high'),
  MB('mb-11', 'Gigabyte Z690 Aorus Elite AX', 'Gigabyte', 'LGA 1700', 'Z690', 'ATX', 'DDR5', 128, 4, 'PCIe 5.0', 3, 6, 259, true, 'high'),
  MB('mb-12', 'ASUS Prime H670-PLUS D4', 'ASUS', 'LGA 1700', 'H670', 'ATX', 'DDR4', 128, 4, 'PCIe 4.0', 2, 6, 169, false, 'mid'),
  MB('mb-13', 'ASRock B660M Pro RS', 'ASRock', 'LGA 1700', 'B660', 'mATX', 'DDR4', 128, 4, 'PCIe 4.0', 2, 4, 95, false, 'entry'),
  MB('mb-14', 'MSI MPG Z590 Gaming Edge WiFi', 'MSI', 'LGA 1200', 'Z590', 'ATX', 'DDR4', 128, 4, 'PCIe 4.0', 3, 6, 249, true, 'high'),
  MB('mb-15', 'ASUS ROG Strix B550-F Gaming WiFi II', 'ASUS', 'AM4', 'B550', 'ATX', 'DDR4', 128, 4, 'PCIe 4.0', 2, 6, 219, true, 'mid'),
  MB('mb-16', 'MSI MAG B550 Tomahawk', 'MSI', 'AM4', 'B550', 'ATX', 'DDR4', 128, 4, 'PCIe 4.0', 2, 6, 179, false, 'mid'),
  MB('mb-17', 'Gigabyte X570 Aorus Elite', 'Gigabyte', 'AM4', 'X570', 'ATX', 'DDR4', 128, 4, 'PCIe 4.0', 2, 8, 199, false, 'high'),
  MB('mb-18', 'ASRock B550M Steel Legend', 'ASRock', 'AM4', 'B550', 'mATX', 'DDR4', 128, 4, 'PCIe 4.0', 2, 4, 139, false, 'mid'),
  MB('mb-19', 'ASUS TUF Gaming B550M-Plus WiFi', 'ASUS', 'AM4', 'B550', 'mATX', 'DDR4', 128, 4, 'PCIe 4.0', 2, 6, 159, true, 'mid'),
  MB('mb-20', 'MSI B450 Tomahawk MAX II', 'MSI', 'AM4', 'B450', 'ATX', 'DDR4', 64, 4, 'PCIe 3.0', 2, 6, 109, false, 'entry'),
  MB('mb-21', 'Gigabyte A520M DS3H', 'Gigabyte', 'AM4', 'A520', 'mATX', 'DDR4', 64, 2, 'PCIe 3.0', 1, 4, 69, false, 'entry'),
  MB('mb-22', 'ASRock X570 Taichi', 'ASRock', 'AM4', 'X570', 'ATX', 'DDR4', 128, 4, 'PCIe 4.0', 3, 8, 299, true, 'high'),
  MB('mb-23', 'ASUS ROG Crosshair X670E Hero', 'ASUS', 'AM5', 'X670E', 'ATX', 'DDR5', 192, 4, 'PCIe 5.0', 4, 8, 699, true, 'enthusiast'),
  MB('mb-24', 'MSI MAG X670E Tomahawk WiFi', 'MSI', 'AM5', 'X670E', 'ATX', 'DDR5', 128, 4, 'PCIe 5.0', 3, 6, 349, true, 'high'),
  MB('mb-25', 'Gigabyte X670 Aorus Elite AX', 'Gigabyte', 'AM5', 'X670', 'ATX', 'DDR5', 128, 4, 'PCIe 5.0', 3, 6, 299, true, 'high'),
  MB('mb-26', 'ASUS ROG Strix X670E-A Gaming WiFi', 'ASUS', 'AM5', 'X670E', 'ATX', 'DDR5', 128, 4, 'PCIe 5.0', 4, 8, 379, true, 'high'),
  MB('mb-27', 'MSI PRO B650-P WiFi', 'MSI', 'AM5', 'B650', 'ATX', 'DDR5', 128, 4, 'PCIe 4.0', 2, 4, 179, true, 'mid'),
  MB('mb-28', 'Gigabyte B650 Aorus Elite AX', 'Gigabyte', 'AM5', 'B650', 'ATX', 'DDR5', 128, 4, 'PCIe 4.0', 2, 4, 219, true, 'mid'),
  MB('mb-29', 'ASRock B650M-HDV/M.2', 'ASRock', 'AM5', 'B650', 'mATX', 'DDR5', 128, 2, 'PCIe 4.0', 2, 4, 119, false, 'entry'),
  MB('mb-30', 'ASUS TUF Gaming B650-Plus WiFi', 'ASUS', 'AM5', 'B650', 'ATX', 'DDR5', 128, 4, 'PCIe 4.0', 3, 4, 239, true, 'mid'),
  MB('mb-31', 'MSI MPG X870E Carbon WiFi', 'MSI', 'AM5', 'X870E', 'ATX', 'DDR5', 256, 4, 'PCIe 5.0', 4, 8, 499, true, 'enthusiast'),
  MB('mb-32', 'ASUS ROG Strix B850-A Gaming WiFi7', 'ASUS', 'AM5', 'B850', 'ATX', 'DDR5', 192, 4, 'PCIe 5.0', 3, 4, 269, true, 'mid'),
  MB('mb-33', 'Gigabyte X870E Aorus Pro', 'Gigabyte', 'AM5', 'X870E', 'ATX', 'DDR5', 256, 4, 'PCIe 5.0', 4, 6, 399, true, 'high'),
  MB('mb-34', 'ASRock TRX50 WS', 'ASRock', 'sTR5', 'TRX50', 'E-ATX', 'DDR5 ECC', 512, 8, 'PCIe 5.0', 4, 8, 1199, true, 'enthusiast'),
  MB('mb-35', 'ASUS Pro WS WRX90E-SAGE SE', 'ASUS', 'sWRX90', 'WRX90', 'E-ATX', 'DDR5 ECC', 2048, 8, 'PCIe 5.0', 7, 8, 1999, false, 'enthusiast'),
  MB('mb-36', 'Supermicro X13SAE-TF', 'Supermicro', 'LGA 4677', 'C741', 'ATX', 'DDR5 ECC', 2048, 8, 'PCIe 5.0', 2, 8, 1099, false, 'enthusiast'),
  MB('mb-37', 'ASUS WS C266 PRO', 'ASUS', 'LGA 2066', 'C246', 'ATX', 'DDR4 ECC', 512, 6, 'PCIe 3.0', 2, 10, 699, false, 'high'),
  MB('mb-38', 'Gigabyte X470 Aorus Gaming 7 WiFi', 'Gigabyte', 'AM4', 'X470', 'ATX', 'DDR4', 64, 4, 'PCIe 3.0', 2, 6, 189, true, 'high'),
  MB('mb-39', 'ASUS ROG Maximus XI Hero', 'ASUS', 'LGA 1151', 'Z390', 'ATX', 'DDR4', 64, 4, 'PCIe 3.0', 2, 6, 299, true, 'high'),
  MB('mb-40', 'MSI MPG Z390 Gaming Pro Carbon AC', 'MSI', 'LGA 1151', 'Z390', 'ATX', 'DDR4', 128, 4, 'PCIe 3.0', 3, 6, 249, true, 'high'),
  MB('mb-41', 'ASRock Z390 Phantom Gaming-ITX/TB3', 'ASRock', 'LGA 1151', 'Z390', 'ITX', 'DDR4', 64, 2, 'PCIe 3.0', 1, 6, 279, true, 'high'),
  MB('mb-42', 'Gigabyte Z490 Aorus Ultra', 'Gigabyte', 'LGA 1200', 'Z490', 'ATX', 'DDR4', 128, 4, 'PCIe 3.0', 3, 6, 279, true, 'high'),
  MB('mb-43', 'ASUS ROG Strix B460-I Gaming WiFi', 'ASUS', 'LGA 1200', 'B460', 'ITX', 'DDR4', 64, 2, 'PCIe 3.0', 1, 4, 189, true, 'mid'),
  MB('mb-44', 'MSI MEG Z490I Unify', 'MSI', 'LGA 1200', 'Z490', 'ITX', 'DDR4', 128, 2, 'PCIe 3.0', 2, 4, 299, true, 'enthusiast'),
  MB('mb-45', 'ASRock B550 Phantom Gaming ITX/AC', 'ASRock', 'AM4', 'B550', 'ITX', 'DDR4', 128, 2, 'PCIe 4.0', 2, 4, 199, true, 'mid'),
  MB('mb-46', 'Gigabyte B650I Aorus Ultra', 'Gigabyte', 'AM5', 'B650', 'ITX', 'DDR5', 64, 2, 'PCIe 4.0', 2, 4, 279, true, 'high'),
  MB('mb-47', 'ASUS ROG Strix X670E-I Gaming WiFi', 'ASUS', 'AM5', 'X670E', 'ITX', 'DDR5', 64, 2, 'PCIe 5.0', 2, 4, 419, true, 'enthusiast'),
  MB('mb-48', 'MSI MPG B760I Edge WiFi', 'MSI', 'LGA 1700', 'B760', 'ITX', 'DDR5', 64, 2, 'PCIe 4.0', 2, 4, 199, true, 'mid'),
  MB('mb-49', 'ASUS Prime Z790-P WiFi D4', 'ASUS', 'LGA 1700', 'Z790', 'ATX', 'DDR4', 128, 4, 'PCIe 5.0', 3, 4, 239, true, 'mid'),
  MB('mb-50', 'NZXT N7 Z790', 'NZXT', 'LGA 1700', 'Z790', 'ATX', 'DDR5', 128, 4, 'PCIe 5.0', 3, 6, 249, true, 'mid'),
  MB('mb-51', 'ASRock X670E Taichi Carrara', 'ASRock', 'AM5', 'X670E', 'ATX', 'DDR5', 128, 4, 'PCIe 5.0', 3, 8, 499, true, 'enthusiast'),
  MB('mb-52', 'Biostar B660MH-E', 'Biostar', 'LGA 1700', 'B660', 'mATX', 'DDR4', 64, 2, 'PCIe 4.0', 1, 4, 69, false, 'entry')
];

// ---------------- RAM ----------------
const RAM = (id, name, brand, type, capacityGB, speedMTs, cl, voltage, sticks, price, rgb, lowProfile) =>
  ({ id, name, brand, type, capacityGB, speedMTs, cl, voltage, sticks, price, rgb, lowProfile });
const ramKits = [
  RAM('ram-1', 'G.Skill Trident Z5 RGB 32GB (2x16) DDR5-6400', 'G.Skill', 'DDR5', 32, 6400, 32, 1.35, 2, 129, true, false),
  RAM('ram-2', 'G.Skill Trident Z5 RGB 64GB (2x32) DDR5-6000', 'G.Skill', 'DDR5', 64, 6000, 30, 1.35, 2, 209, true, false),
  RAM('ram-3', 'Corsair Dominator Titanium 32GB (2x16) DDR5-6600', 'Corsair', 'DDR5', 32, 6600, 32, 1.4, 2, 154, true, false),
  RAM('ram-4', 'Corsair Vengeance 32GB (2x16) DDR5-6000', 'Corsair', 'DDR5', 32, 6000, 30, 1.25, 2, 109, false, true),
  RAM('ram-5', 'Kingston Fury Beast 32GB (2x16) DDR5-5600', 'Kingston', 'DDR5', 32, 5600, 40, 1.25, 2, 94, false, false),
  RAM('ram-6', 'TeamGroup T-Force Delta RGB 32GB (2x16) DDR5-6000', 'TeamGroup', 'DDR5', 32, 6000, 38, 1.25, 2, 99, true, false),
  RAM('ram-7', 'G.Skill Flare X5 32GB (2x16) DDR5-6000 CL36', 'G.Skill', 'DDR5', 32, 6000, 36, 1.35, 2, 114, false, true),
  RAM('ram-8', 'Corsair Vengeance 64GB (2x32) DDR5-5600', 'Corsair', 'DDR5', 64, 5600, 40, 1.1, 2, 179, false, true),
  RAM('ram-9', 'Kingston Fury Renegade 32GB (2x16) DDR5-7200', 'Kingston', 'DDR5', 32, 7200, 36, 1.4, 2, 174, true, false),
  RAM('ram-10', 'Patriot Viper Venom 32GB (2x16) DDR5-6200', 'Patriot', 'DDR5', 32, 6200, 40, 1.25, 2, 104, true, false),
  RAM('ram-11', 'Crucial Pro 32GB (2x16) DDR5-5600', 'Crucial', 'DDR5', 32, 5600, 46, 1.1, 2, 89, false, true),
  RAM('ram-12', 'G.Skill Ripjaws S5 32GB (2x16) DDR5-5800', 'G.Skill', 'DDR5', 32, 5800, 30, 1.25, 2, 104, false, true),
  RAM('ram-13', 'Corsair Vengeance LPX 32GB (2x16) DDR4-3600', 'Corsair', 'DDR4', 32, 3600, 18, 1.35, 2, 79, false, true),
  RAM('ram-14', 'G.Skill Trident Z Neo 32GB (2x16) DDR4-3600', 'G.Skill', 'DDR4', 32, 3600, 16, 1.35, 2, 89, true, false),
  RAM('ram-15', 'Kingston Fury Beast 16GB (2x8) DDR4-3200', 'Kingston', 'DDR4', 16, 3200, 16, 1.25, 2, 42, false, true),
  RAM('ram-16', 'Corsair Vengeance RGB Pro 32GB (2x16) DDR4-3200', 'Corsair', 'DDR4', 32, 3200, 16, 1.35, 2, 74, true, false),
  RAM('ram-17', 'TeamGroup T-Force Vulcan 16GB (2x8) DDR4-3200', 'TeamGroup', 'DDR4', 16, 3200, 16, 1.35, 2, 36, false, true),
  RAM('ram-18', 'Crucial Ballistix 16GB (2x8) DDR4-3000', 'Crucial', 'DDR4', 16, 3000, 15, 1.35, 2, 38, false, true),
  RAM('ram-19', 'G.Skill Ripjaws V 16GB (2x8) DDR4-3200', 'G.Skill', 'DDR4', 16, 3200, 16, 1.35, 2, 40, false, true),
  RAM('ram-20', 'Kingston Fury Beast 64GB (2x32) DDR4-3200', 'Kingston', 'DDR4', 64, 3200, 16, 1.2, 2, 139, false, true),
  RAM('ram-21', 'Corsair Vengeance LPX 64GB (4x16) DDR4-3200', 'Corsair', 'DDR4', 64, 3200, 16, 1.35, 4, 149, false, true),
  RAM('ram-22', 'G.Skill Trident Z Royal 32GB (2x16) DDR4-4000', 'G.Skill', 'DDR4', 32, 4000, 18, 1.4, 2, 119, true, false),
  RAM('ram-23', 'Patriot Viper Steel 32GB (2x16) DDR4-3733', 'Patriot', 'DDR4', 32, 3733, 19, 1.35, 2, 84, false, true),
  RAM('ram-24', 'Silicon Power XPG Gammix D10 16GB (2x8) DDR4-3200', 'XPG', 'DDR4', 16, 3200, 16, 1.35, 2, 37, true, false),
  RAM('ram-25', 'ADATA XPG Lancer Blade 32GB (2x16) DDR5-6000', 'XPG', 'DDR5', 32, 6000, 30, 1.35, 2, 109, false, true),
  RAM('ram-26', 'Corsair Dominator Platinum 64GB (4x16) DDR5-6200', 'Corsair', 'DDR5', 64, 6200, 30, 1.35, 4, 289, true, false),
  RAM('ram-27', 'G.Skill Trident Z5 RGB 96GB (2x48) DDR5-6000', 'G.Skill', 'DDR5', 96, 6000, 30, 1.35, 2, 299, true, false),
  RAM('ram-28', 'Kingston Fury Beast 128GB (4x32) DDR5-5200', 'Kingston', 'DDR5', 128, 5200, 40, 1.1, 4, 429, false, true),
  RAM('ram-29', 'Crucial Pro 64GB (2x32) DDR5-4800', 'Crucial', 'DDR5', 64, 4800, 40, 1.1, 2, 164, false, true),
  RAM('ram-30', 'TeamGroup T-Create Expert 32GB (2x16) DDR4-3200', 'TeamGroup', 'DDR4', 32, 3200, 16, 1.35, 2, 64, false, true),
  RAM('ram-31', 'Samsung 16GB (1x16) DDR4-3200 ECC UDIMM', 'Samsung', 'DDR4', 16, 3200, 22, 1.2, 1, 55, false, true),
  RAM('ram-32', 'SK Hynix 16GB (1x16) DDR5-4800', 'SK Hynix', 'DDR5', 16, 4800, 40, 1.1, 1, 49, false, true),
  RAM('ram-33', 'Micron Crucial 8GB (1x8) DDR4-2666', 'Crucial', 'DDR4', 8, 2666, 19, 1.2, 1, 22, false, true),
  RAM('ram-34', 'Corsair Vengeance 16GB (2x8) DDR5-5200', 'Corsair', 'DDR5', 16, 5200, 40, 1.25, 2, 62, false, true),
  RAM('ram-35', 'G.Skill Aegis 16GB (2x8) DDR4-3000', 'G.Skill', 'DDR4', 16, 3000, 16, 1.35, 2, 35, false, true),
  RAM('ram-36', 'Kingston ValueRAM 32GB (2x16) DDR4-2666 ECC', 'Kingston', 'DDR4', 32, 2666, 19, 1.2, 2, 88, false, true),
  RAM('ram-37', 'Corsair Dominator DDR5-8000 32GB (2x16)', 'Corsair', 'DDR5', 32, 8000, 38, 1.45, 2, 259, true, false),
  RAM('ram-38', 'G.Skill Trident Z5 RGB 32GB (2x16) DDR5-8000', 'G.Skill', 'DDR5', 32, 8000, 38, 1.4, 2, 219, true, false),
  RAM('ram-39', 'TeamGroup T-Force Delta RGB 64GB (2x32) DDR5-6400', 'TeamGroup', 'DDR5', 64, 6400, 32, 1.4, 2, 214, true, false),
  RAM('ram-40', 'Patriot Viper Elite 5 32GB (2x16) DDR5-5600', 'Patriot', 'DDR5', 32, 5600, 36, 1.25, 2, 87, false, true),
  RAM('ram-41', 'ADATA XPG Battlecruiser 32GB (2x16) DDR5-6800', 'XPG', 'DDR5', 32, 6800, 32, 1.4, 2, 144, true, false),
  RAM('ram-42', 'Crucial 8GB (1x8) DDR3-1600', 'Crucial', 'DDR4', 8, 1600, 11, 1.5, 1, 18, false, true)
].map((r) => (r.id === 'ram-42' ? { ...r, name: 'Crucial 8GB (1x8) DDR3-1600', type: 'DDR4' } : r));

// ---------------- Storage ----------------
const ST = (id, name, brand, kind, capacityGB, readMBs, writeMBs, iface, tbw, price) =>
  ({ id, name, brand, kind, capacityGB, readMBs, writeMBs, interface: iface, tbw, price });
const storage = [
  ST('st-1', 'Samsung 990 Pro 2TB', 'Samsung', 'NVMe SSD', 2000, 7450, 6900, 'PCIe 4.0 x4 NVMe', 1200, 169),
  ST('st-2', 'Samsung 990 Pro 1TB', 'Samsung', 'NVMe SSD', 1000, 7450, 6900, 'PCIe 4.0 x4 NVMe', 600, 99),
  ST('st-3', 'WD Black SN850X 2TB', 'Western Digital', 'NVMe SSD', 2000, 7300, 6600, 'PCIe 4.0 x4 NVMe', 1200, 179),
  ST('st-4', 'WD Black SN850X 1TB', 'Western Digital', 'NVMe SSD', 1000, 7300, 6300, 'PCIe 4.0 x4 NVMe', 600, 94),
  ST('st-5', 'SK hynix Platinum P41 2TB', 'SK hynix', 'NVMe SSD', 2000, 7000, 6500, 'PCIe 4.0 x4 NVMe', 1200, 159),
  ST('st-6', 'Crucial T700 2TB', 'Crucial', 'NVMe SSD', 2000, 12400, 11800, 'PCIe 5.0 x4 NVMe', 1200, 339),
  ST('st-7', 'Corsair MP700 2TB', 'Corsair', 'NVMe SSD', 2000, 12400, 11800, 'PCIe 5.0 x4 NVMe', 3000, 289),
  ST('st-8', 'Seagate FireCuda 540 2TB', 'Seagate', 'NVMe SSD', 2000, 10000, 10000, 'PCIe 5.0 x4 NVMe', 2000, 299),
  ST('st-9', 'Samsung 980 Pro 1TB', 'Samsung', 'NVMe SSD', 1000, 7000, 5000, 'PCIe 4.0 x4 NVMe', 600, 89),
  ST('st-10', 'WD Black SN770 1TB', 'Western Digital', 'NVMe SSD', 1000, 5150, 4900, 'PCIe 4.0 x4 NVMe', 600, 69),
  ST('st-11', 'Kingston NV2 1TB', 'Kingston', 'NVMe SSD', 1000, 3500, 2100, 'PCIe 4.0 x4 NVMe', 320, 54),
  ST('st-12', 'Crucial P3 Plus 2TB', 'Crucial', 'NVMe SSD', 2000, 5000, 3600, 'PCIe 4.0 x4 NVMe', 440, 109),
  ST('st-13', 'TeamGroup MP44 1TB', 'TeamGroup', 'NVMe SSD', 1000, 5000, 4800, 'PCIe 4.0 x4 NVMe', 600, 62),
  ST('st-14', 'Addlink S78 1TB', 'Addlink', 'NVMe SSD', 1000, 5000, 4500, 'PCIe 4.0 x4 NVMe', 600, 58),
  ST('st-15', 'Samsung 870 EVO 1TB', 'Samsung', 'SATA SSD', 1000, 560, 530, 'SATA III', 600, 89),
  ST('st-16', 'Samsung 870 EVO 2TB', 'Samsung', 'SATA SSD', 2000, 560, 530, 'SATA III', 1200, 169),
  ST('st-17', 'Crucial MX500 1TB', 'Crucial', 'SATA SSD', 1000, 560, 510, 'SATA III', 360, 69),
  ST('st-18', 'Crucial MX500 500GB', 'Crucial', 'SATA SSD', 500, 560, 510, 'SATA III', 180, 42),
  ST('st-19', 'Kingston A400 480GB', 'Kingston', 'SATA SSD', 480, 500, 450, 'SATA III', 160, 32),
  ST('st-20', 'WD Blue SA510 1TB', 'Western Digital', 'SATA SSD', 1000, 560, 510, 'SATA III', 400, 74),
  ST('st-21', 'SanDisk Ultra 3D 1TB', 'SanDisk', 'SATA SSD', 1000, 560, 530, 'SATA III', 400, 79),
  ST('st-22', 'SabRocket 2TB SATA SSD', 'Sabrent', 'SATA SSD', 2000, 560, 530, 'SATA III', 1200, 179),
  ST('st-23', 'Seagate BarraCuda 2TB HDD', 'Seagate', 'HDD', 2000, 220, 220, 'SATA III', null, 49),
  ST('st-24', 'Seagate BarraCuda 4TB HDD', 'Seagate', 'HDD', 4000, 220, 220, 'SATA III', null, 79),
  ST('st-25', 'WD Blue 4TB HDD', 'Western Digital', 'HDD', 4000, 200, 200, 'SATA III', null, 84),
  ST('st-26', 'Toshiba N300 8TB HDD', 'Toshiba', 'HDD', 8000, 270, 270, 'SATA III', null, 159),
  ST('st-27', 'WD Red Plus 8TB HDD', 'Western Digital', 'HDD', 8000, 215, 215, 'SATA III', null, 179),
  ST('st-28', 'Seagate IronWolf 12TB HDD', 'Seagate', 'HDD', 12000, 250, 250, 'SATA III', null, 249),
  ST('st-29', 'WD Black AN1500 4TB (add-in)', 'Western Digital', 'NVMe SSD', 4000, 6500, 4100, 'PCIe 3.0 x8', 3200, 499),
  ST('st-30', 'Intel Optane 905P 480GB', 'Intel', 'SATA SSD', 480, 2600, 2200, 'U.2 PCIe', 8760, 399),
  ST('st-31', 'Samsung PM9A1 1TB OEM', 'Samsung', 'NVMe SSD', 1000, 7000, 5000, 'PCIe 4.0 x4 NVMe', 600, 69),
  ST('st-32', 'Kingson KC3000 2TB', 'Kingston', 'NVMe SSD', 2000, 7000, 7000, 'PCIe 4.0 x4 NVMe', 1600, 149),
  ST('st-33', 'Solidigm P44 Pro 1TB', 'Solidigm', 'NVMe SSD', 1000, 7000, 6500, 'PCIe 4.0 x4 NVMe', 600, 84),
  ST('st-34', 'Verbatim Vi550 S3 1TB', 'Verbatim', 'NVMe SSD', 1000, 3400, 2400, 'PCIe 4.0 x4 NVMe', 400, 49),
  ST('st-35', 'Patriot P300 1TB', 'Patriot', 'NVMe SSD', 1000, 3500, 2700, 'PCIe 4.0 x4 NVMe', 1000, 52),
  ST('st-36', 'LaCie Rugged USB-C 2TB', 'LaCie', 'HDD', 2000, 130, 130, 'USB 3.1', null, 99),
  ST('st-37', 'Samsung T7 Shield 2TB Portable SSD', 'Samsung', 'SATA SSD', 2000, 1050, 1000, 'USB 3.2', 1200, 169),
  ST('st-38', 'Crucial X9 Pro 2TB Portable SSD', 'Crucial', 'SATA SSD', 2000, 1050, 1050, 'USB 3.2', 1200, 159),
  ST('st-39', 'WD My Book 18TB HDD', 'Western Digital', 'HDD', 18000, 170, 170, 'USB 3.0', null, 329),
  ST('st-40', 'AGItek Pro 1TB', 'AGItek', 'NVMe SSD', 1000, 3400, 3000, 'PCIe 4.0 x4 NVMe', 600, 47),
  ST('st-41', 'Netac NV3000 1TB', 'Netac', 'NVMe SSD', 1000, 3500, 2800, 'PCIe 4.0 x4 NVMe', 640, 51),
  ST('st-42', 'Fanxiang S880 2TB', 'Fanxiang', 'NVMe SSD', 2000, 7400, 6500, 'PCIe 4.0 x4 NVMe', 1200, 119)
];

// ---------------- PSUs ----------------
const PSU = (id, name, brand, watts, eff, modular, ff, price) => ({ id, name, brand, watts, efficiency: eff, modular: modular, formFactor: ff, price });
const psus = [
  PSU('psu-1', 'Corsair RM1000x', 'Corsair', 1000, '80+ Gold', 'Full-modular', 'ATX', 189),
  PSU('psu-2', 'Corsair RM850x', 'Corsair', 850, '80+ Gold', 'Full-modular', 'ATX', 149),
  PSU('psu-3', 'Corsair RM750e', 'Corsair', 750, '80+ Bronze', 'Full-modular', 'ATX', 99),
  PSU('psu-4', 'Corsair HX1200i', 'Corsair', 1200, '80+ Platinum', 'Full-modular', 'ATX', 259),
  PSU('psu-5', 'Corsair SF750', 'Corsair', 750, '80+ Platinum', 'Full-modular', 'SFX', 164),
  PSU('psu-6', 'Seasonic TX-1000', 'Seasonic', 1000, '80+ Titanium', 'Full-modular', 'ATX', 329),
  PSU('psu-7', 'Seasonic Focus GX-750', 'Seasonic', 750, '80+ Gold', 'Full-modular', 'ATX', 109),
  PSU('psu-8', 'EVGA SuperNOVA 850 G6', 'EVGA', 850, '80+ Gold', 'Full-modular', 'ATX', 149),
  PSU('psu-9', 'EVGA 600 BR', 'EVGA', 600, '80+ Bronze', 'Non-modular', 'ATX', 59),
  PSU('psu-10', 'be quiet! Dark Power 13 1000W', 'be quiet!', 1000, '80+ Titanium', 'Full-modular', 'ATX', 289),
  PSU('psu-11', 'be quiet! Pure Power 12 M 750W', 'be quiet!', 750, '80+ Silver', 'Full-modular', 'ATX', 99),
  PSU('psu-12', 'Thermaltake Toughpower GF3 1200W', 'Thermaltake', 1200, '80+ Gold', 'Full-modular', 'ATX', 219),
  PSU('psu-13', 'MSI MAG A850GL', 'MSI', 850, '80+ Gold', 'Full-modular', 'ATX', 119),
  PSU('psu-14', 'MSI MAG A650BN', 'MSI', 650, '80+ Bronze', 'Non-modular', 'ATX', 59),
  PSU('psu-15', 'Cooler Master MWE Gold 750 V2', 'Cooler Master', 750, '80+ Gold', 'Full-modular', 'ATX', 94),
  PSU('psu-16', 'Deepcool PQ750M', 'Deepcool', 750, '80+ Platinum', 'Full-modular', 'ATX', 109),
  PSU('psu-17', 'SilverStone DA800', 'SilverStone', 800, '80+ Gold', 'Full-modular', 'SFX-L', 159),
  PSU('psu-18', 'Corsair SF600', 'Corsair', 600, '80+ Platinum', 'Full-modular', 'SFX', 119),
  PSU('psu-19', 'Rosewill ARC SFX 450W', 'Rosewill', 450, '80+ Gold', 'Semi-modular', 'SFX', 69),
  PSU('psu-20', 'NZXT C850 Gold', 'NZXT', 850, '80+ Gold', 'Full-modular', 'ATX', 134),
  PSU('psu-21', 'Fractal Design ION+ 2P 860W', 'Fractal Design', 860, '80+ Platinum', 'Full-modular', 'ATX', 179),
  PSU('psu-22', 'Phanteks AMP 750W', 'Phanteks', 750, '80+ Gold', 'Full-modular', 'ATX', 99),
  PSU('psu-23', 'Lian Li SP750SG', 'Lian Li', 750, '80+ Gold', 'Full-modular', 'SFX', 139),
  PSU('psu-24', 'Enermax Revolution D.F. 1050W', 'Enermax', 1050, '80+ Gold', 'Full-modular', 'ATX', 189),
  PSU('psu-25', 'Antec EarthMax Green 550W', 'Antec', 550, '80+ Bronze', 'Non-modular', 'ATX', 54),
  PSU('psu-26', 'OCZ ModXStream 500W', 'OCZ', 500, '80+ Bronze', 'Semi-modular', 'ATX', 45),
  PSU('psu-27', 'Corsair CX550M', 'Corsair', 550, '80+ Bronze', 'Semi-modular', 'ATX', 59),
  PSU('psu-28', 'Seasonic PRIME TX-1300', 'Seasonic', 1300, '80+ Titanium', 'Full-modular', 'ATX', 429),
  PSU('psu-29', 'be quiet! Straight Power 12 1500W', 'be quiet!', 1500, '80+ Platinum', 'Full-modular', 'ATX', 449),
  PSU('psu-30', 'Thermaltake Smart 500W', 'Thermaltake', 500, '80+', 'Non-modular', 'ATX', 44),
  PSU('psu-31', 'MSI MPG A1000G PCIE5', 'MSI', 1000, '80+ Gold', 'Full-modular', 'ATX', 179),
  PSU('psu-32', 'Corsair RM1200x SHIFT', 'Corsair', 1200, '80+ Gold', 'Full-modular', 'ATX', 249)
];

// ---------------- Cases ----------------
const CS = (id, name, brand, support, type, gpu, cooler, bays, airflow, price) =>
  ({ id, name, brand, formFactorSupport: support, type, maxGpuMm: gpu, maxCoolerMm: cooler, driveBays: bays, airflow, price });
const cases = [
  CS('case-1', 'Fractal Design North', 'Fractal Design', ['ATX', 'mATX', 'ITX'], 'Tower', 355, 170, 4, 'excellent', 139),
  CS('case-2', 'Lian Li O11 Dynamic EVO', 'Lian Li', ['ATX', 'mATX', 'ITX', 'E-ATX'], 'Tower', 427, 167, 4, 'excellent', 169),
  CS('case-3', 'NZXT H7 Flow', 'NZXT', ['ATX', 'mATX', 'ITX'], 'Tower', 400, 185, 4, 'excellent', 129),
  CS('case-4', 'Corsair 4000D Airflow', 'Corsair', ['ATX', 'mATX', 'ITX'], 'Tower', 360, 170, 4, 'excellent', 104),
  CS('case-5', 'be quiet! Pure Base 500DX', 'be quiet!', ['ATX', 'mATX', 'ITX'], 'Tower', 369, 190, 3, 'good', 109),
  CS('case-6', 'Fractal Design Torrent', 'Fractal Design', ['ATX', 'E-ATX', 'mATX'], 'Full Tower', 440, 180, 6, 'excellent', 189),
  CS('case-7', 'Phanteks Enthoo Pro 2', 'Phanteks', ['ATX', 'E-ATX', 'mATX', 'ITX'], 'Full Tower', 400, 190, 8, 'excellent', 149),
  CS('case-8', 'Cooler Master NR200P', 'Cooler Master', ['mATX', 'ITX'], 'MiniTower', 330, 155, 4, 'good', 99),
  CS('case-9', 'SSUPD Meshlicious', 'SSUPD', ['mATX', 'ITX'], 'MiniTower', 322, 72, 2, 'excellent', 119),
  CS('case-10', 'Lian Li A4-H2O', 'Lian Li', ['ITX'], 'ITX', 245, 58, 2, 'good', 124),
  CS('case-11', 'Dan Cases A4-HFO', 'Dan Cases', ['ITX'], 'ITX', 290, 55, 1, 'excellent', 139),
  CS('case-12', 'Thermaltake Core P3 TG Pro', 'Thermaltake', ['ATX', 'mATX', 'ITX'], 'Tower', 335, 180, 4, 'good', 124),
  CS('case-13', 'Jonsbo D31 Mesh', 'Jonsbo', ['mATX', 'ITX'], 'MicroTower', 335, 165, 3, 'excellent', 79),
  CS('case-14', 'Asus Prime AP201', 'ASUS', ['mATX', 'ITX'], 'MicroTower', 338, 163, 3, 'excellent', 99),
  CS('case-15', 'Corsair 5000D Airflow', 'Corsair', ['ATX', 'E-ATX', 'mATX', 'ITX'], 'Tower', 360, 170, 6, 'excellent', 164),
  CS('case-16', 'NZXT H5 Flow', 'NZXT', ['ATX', 'mATX', 'ITX'], 'Tower', 365, 165, 4, 'good', 94),
  CS('case-17', 'Fractal Design Define 7 Compact', 'Fractal Design', ['ATX', 'mATX', 'ITX'], 'MicroTower', 364, 169, 5, 'okay', 109),
  CS('case-18', 'SilverStone FARA H1M', 'SilverStone', ['mATX', 'ITX'], 'MicroTower', 330, 162, 4, 'excellent', 79),
  CS('case-19', 'Meshify C Mini', 'Fractal Design', ['mATX', 'ITX'], 'MicroTower', 315, 170, 2, 'good', 89),
  CS('case-20', 'InWin A1', 'InWin', ['ITX'], 'ITX', 240, 70, 2, 'good', 119),
  CS('case-21', 'Cougar Duoface', 'Cougar', ['ATX', 'mATX', 'ITX'], 'Tower', 355, 175, 4, 'excellent', 89),
  CS('case-22', 'Montech AIR 1000 ARGO', 'Montech', ['ATX', 'mATX', 'ITX'], 'Tower', 380, 180, 4, 'excellent', 89),
  CS('case-23', 'Endorfy Regnum 4000X', 'Endorfy', ['ATX', 'E-ATX', 'mATX'], 'Full Tower', 400, 185, 6, 'excellent', 139),
  CS('case-24', 'Hyte Y70 Touch', 'Corsair', ['ATX', 'mATX', 'ITX'], 'Tower', 410, 180, 4, 'good', 179),
  CS('case-25', 'Node 202', 'Fractal Design', ['mATX', 'ITX'], 'MicroTower', 320, 150, 4, 'good', 129)
];

// ---------------- Coolers ----------------
const CO = (id, name, brand, type, sockets, tdpRating, height, rad, noise, price) =>
  ({ id, name, brand, type, sockets, tdpRating, heightMm: height, radiatorMm: rad, noiseDb: noise, price });
const coolers = [
  CO('co-1', 'Noctua NH-D15 chromax.black', 'Noctua', 'air', ['AM4', 'AM5', 'LGA 1700', 'LGA 1200', 'LGA 2066'], 250, 165, null, 24.6, 109),
  CO('co-2', 'Deepcool AK620', 'Deepcool', 'air', ['AM4', 'AM5', 'LGA 1700', 'LGA 1200'], 240, 160, null, 28, 69),
  CO('co-3', 'Thermalright Peerless Assassin 120 SE', 'Thermalright', 'air', ['AM4', 'AM5', 'LGA 1700', 'LGA 1200', 'LGA 1151'], 245, 157, null, 26, 39),
  CO('co-4', 'be quiet! Dark Rock Pro 5', 'be quiet!', 'air', ['AM4', 'AM5', 'LGA 1700', 'LGA 1200'], 250, 168, null, 24.5, 89),
  CO('co-5', 'Noctua NH-U12S Redux', 'Noctua', 'air', ['AM4', 'AM5', 'LGA 1700', 'LGA 1200', 'LGA 1151'], 180, 158, null, 22.6, 59),
  CO('co-6', 'CryoRig MK.IV', 'CryoRig', 'air', ['AM4', 'LGA 1700', 'LGA 1200'], 220, 167, null, 30, 54),
  CO('co-7', 'ID-Cooling SE-226-XT', 'ID-Cooling', 'air', ['AM4', 'AM5', 'LGA 1700', 'LGA 1200'], 255, 155, null, 32, 45),
  CO('co-8', 'Arctic Liquid Freezer II 360', 'Arctic', 'aio', ['AM4', 'AM5', 'LGA 1700', 'LGA 1200', 'LGA 2066'], 320, null, 360, 22, 99),
  CO('co-9', 'Arctic Liquid Freezer III 240', 'Arctic', 'aio', ['AM4', 'AM5', 'LGA 1700', 'LGA 1200'], 280, null, 240, 22.5, 79),
  CO('co-10', 'NZXT Kraken Elite 360 RGB', 'NZXT', 'aio', ['AM4', 'AM5', 'LGA 1700', 'LGA 1200'], 330, null, 360, 28, 199),
  CO('co-11', 'Corsair iCUE H150i Elite Capellix', 'Corsair', 'aio', ['AM4', 'AM5', 'LGA 1700', 'LGA 1200'], 330, null, 360, 29, 189),
  CO('co-12', 'be quiet! Silent Loop 2 280', 'be quiet!', 'aio', ['AM4', 'AM5', 'LGA 1700', 'LGA 1200'], 300, null, 280, 19.9, 129),
  CO('co-13', 'EK-Nucleus CR240', 'EK', 'aio', ['AM4', 'AM5', 'LGA 1700', 'LGA 1200'], 280, null, 240, 27, 124),
  CO('co-14', 'Thermaltake TH240 V2 Ultra', 'Thermaltake', 'aio', ['AM4', 'AM5', 'LGA 1700', 'LGA 1200'], 280, null, 240, 30, 109),
  CO('co-15', 'SilverStone ICE M1200', 'SilverStone', 'aio', ['AM4', 'AM5', 'LGA 1700', 'LGA 1200', 'LGA 2066', 'LGA 3647'], 350, null, 1200, 36, 399),
  CO('co-16', 'Alphacool Eisblock XPX + 360 kit', 'Alphacool', 'aio', ['AM4', 'AM5', 'LGA 1700', 'LGA 2066'], 400, null, 360, 32, 349),
  CO('co-17', 'Scythe Fuma 3', 'Scythe', 'air', ['AM4', 'AM5', 'LGA 1700', 'LGA 1200'], 230, 155, null, 22, 69),
  CO('co-18', 'Noctua NH-L9a-AM5', 'Noctua', 'air', ['AM4', 'AM5'], 95, 65, null, 14.8, 49),
  CO('co-19', 'Low Profile Big-Sur', 'Jonsbo', 'air', ['AM4', 'AM5', 'LGA 1700'], 150, 70, null, 28, 39),
  CO('co-20', 'ID-Cooling FX360 Pro', 'ID-Cooling', 'aio', ['AM4', 'AM5', 'LGA 1700', 'LGA 1200'], 320, null, 360, 33, 79)
];

// ---------------- Games ----------------
const GM = (id, name, year, genre, minCpu, minGpu, recCpu, recGpu, ram, storage, optimized, upscaling) =>
  ({ id, name, year, genre, minCpu, minGpu, recCpu, recGpu, ramGB: ram, storageGB: storage, optimized, upscaling });
const games = [
  GM('game-1', 'Cyberpunk 2077: Phantom Liberty', 2023, 'RPG', 'Ryzen 5 1600', 'GTX 1060 6GB', 'Ryzen 7 7800X3D', 'RTX 4070', 16, 70, 'good', ['DLSS', 'FSR', 'XeSS', 'PSSR']),
  GM('game-2', "Alan Wake 2", 2023, 'Action Adventure', 'Ryzen 5 3600', 'RTX 2060', 'Ryzen 7 7700X', 'RTX 4080', 16, 160, 'poor', ['DLSS', 'FSR', 'XeSS']),
  GM('game-3', 'Black Myth: Wukong', 2024, 'Action RPG', 'Core i5-8400', 'GTX 1060 6GB', 'Ryzen 7 7800X3D', 'RTX 4070 Ti', 16, 130, 'good', ['DLSS', 'FSR', 'XeSS']),
  GM('game-4', 'Call of Duty: Modern Warfare III', 2023, 'FPS', 'Ryzen 5 1400', 'GTX 960', 'Ryzen 7 5800X', 'RTX 3060 Ti', 16, 150, 'excellent', ['DLSS', 'FSR', 'XeSS']),
  GM('game-5', 'Hogwarts Legacy', 2023, 'Action RPG', 'Ryzen 5 2600', 'GTX 1070', 'Ryzen 7 5800X', 'RTX 3070', 16, 85, 'good', ['DLSS', 'FSR']),
  GM('game-6', 'Forza Horizon 5', 2021, 'Racing', 'Ryzen 3 1200', 'RX 590', 'Ryzen 7 5800X', 'RTX 3060', 12, 110, 'excellent', ['FSR']),
  GM('game-7', 'Red Dead Redemption 2', 2019, 'Action Adventure', 'Ryzen 5 1500X', 'RX 480', 'Ryzen 7 3700X', 'RTX 2080', 12, 150, 'good', ['FSR']),
  GM('game-8', 'Elden Ring', 2022, 'Action RPG', 'Core i5-8400', 'GTX 1060', 'Core i7-10700', 'RTX 2070', 12, 60, 'poor', []),
  GM('game-9', 'Baldur’s Gate 3', 2023, 'RPG', 'Ryzen 5 3600', 'RX 6600 XT', 'Ryzen 7 7800X3D', 'RTX 4070', 16, 150, 'excellent', ['DLSS', 'FSR']),
  GM('game-10', 'Starfield', 2023, 'RPG', 'Ryzen 5 1600', 'GTX 1060', 'Ryzen 7 5800X', 'RTX 2080 Ti', 16, 125, 'poor', ['DLSS', 'FSR']),
  GM('game-11', 'Counter-Strike 2', 2023, 'FPS', 'Core i5-2500K', 'GTX 950', 'Ryzen 5 5600', 'RTX 3060', 8, 32, 'excellent', []),
  GM('game-12', 'Valorant', 2020, 'FPS', 'Core i3-4150', 'GT 730', 'Ryzen 5 5600', 'GTX 1050 Ti', 4, 30, 'excellent', []),
  GM('game-13', 'Fortnite', 2017, 'Battle Royale', 'Core i5-7300H', 'GTX 960', 'Ryzen 7 3700X', 'RTX 3060', 16, 40, 'good', ['DLSS', 'FSR', 'XeSS']),
  GM('game-14', 'Apex Legends', 2019, 'Battle Royale', 'Ryzen 3 2200G', 'GTX 970', 'Ryzen 7 5800X', 'RTX 3060 Ti', 8, 22, 'excellent', []),
  GM('game-15', 'Dota 2', 2013, 'MOBA', 'Core i5-2500K', 'HD 7870', 'Ryzen 5 5600', 'RTX 2060', 8, 60, 'excellent', []),
  GM('game-16', 'League of Legends', 2009, 'MOBA', 'Core i3-530', 'GT 8800', 'Ryzen 5 3600', 'GTX 1050', 8, 22, 'excellent', []),
  GM('game-17', 'Minecraft (with shaders)', 2011, 'Sandbox', 'Core i5-2500K', 'GTX 660', 'Ryzen 7 5800X', 'RTX 4060', 8, 10, 'excellent', ['DLSS']),
  GM('game-18', 'Grand Theft Auto V', 2015, 'Action', 'Core i5-3470', 'GTX 660', 'Ryzen 5 5600', 'RTX 2060', 8, 95, 'excellent', ['DLSS', 'FSR']),
  GM('game-19', 'The Witcher 3: Next-Gen', 2022, 'RPG', 'Ryzen 5 1600', 'GTX 970', 'Ryzen 7 5800X', 'RTX 3070', 12, 50, 'good', ['DLSS', 'FSR', 'XeSS']),
  GM('game-20', 'Assassin’s Creed Mirage', 2023, 'Action', 'Core i7-4770', 'GTX 1060 6GB', 'Ryzen 5 5600', 'RTX 3060 Ti', 12, 65, 'good', ['DLSS', 'FSR', 'XeSS']),
  GM('game-21', 'Diablo IV', 2023, 'ARPG', 'Core i5-4670', 'GTX 960', 'Ryzen 7 5800X', 'RTX 3060', 16, 90, 'excellent', ['DLSS', 'FSR', 'XeSS']),
  GM('game-22', 'Horizon Forbidden West', 2024, 'Action RPG', 'Ryzen 5 2600', 'RX 570', 'Ryzen 7 7700X', 'RTX 4070', 16, 135, 'good', ['DLSS', 'FSR', 'XeSS']),
  GM('game-23', 'God of War Ragnarök PC', 2024, 'Action', 'Ryzen 3 3200G', 'GTX 1650', 'Ryzen 7 5800X', 'RTX 3060 Ti', 16, 190, 'excellent', ['DLSS', 'FSR', 'XeSS']),
  GM('game-24', 'Spider-Man Remastered', 2022, 'Action', 'Core i3-4160', 'GTX 1060', 'Ryzen 7 5800X', 'RTX 3070', 16, 75, 'excellent', ['DLSS', 'FSR', 'XeSS']),
  GM('game-25', 'Flight Simulator 2024', 2024, 'Sim', 'Ryzen 5 2600X', 'RX 5700', 'Ryzen 7 7800X3D', 'RTX 4080', 16, 150, 'poor', ['DLSS', 'FSR']),
  GM('game-26', 'Microsoft Flight Sim 2020', 2020, 'Sim', 'Ryzen 5 1500X', 'RX 570', 'Ryzen 7 5800X', 'RTX 3070', 16, 150, 'poor', ['DLSS', 'FSR']),
  GM('game-27', 'Total War: WARHAMMER III', 2022, 'Strategy', 'Ryzen 5 2600', 'GTX 1060', 'Ryzen 7 5800X', 'RTX 3070', 8, 120, 'good', ['DLSS', 'FSR', 'XeSS']),
  GM('game-28', 'Civilization VI', 2016, 'Strategy', 'Core i5-4670', 'GTX 450', 'Ryzen 5 5600', 'GTX 1660', 4, 14, 'excellent', []),
  GM('game-29', 'Rainbow Six Siege', 2015, 'FPS', 'Core i5-2500K', 'GTX 670', 'Ryzen 7 5800X', 'RTX 3060', 8, 61, 'excellent', []),
  GM('game-30', 'Warzone', 2022, 'Battle Royale', 'Core i5-6600', 'GTX 960', 'Ryzen 7 5800X', 'RTX 3060 Ti', 8, 130, 'good', ['DLSS', 'FSR', 'XeSS']),
  GM('game-31', 'Overwatch 2', 2022, 'FPS', 'Core i3-530', 'GT 730', 'Ryzen 5 5600', 'GTX 1660', 6, 50, 'excellent', []),
  GM('game-32', 'Rocket League', 2015, 'Sports', 'Core i5-750', 'GT 640', 'Ryzen 5 3600', 'GTX 1650', 8, 17, 'excellent', []),
  GM('game-33', 'NBA 2K24', 2023, 'Sports', 'Core i5-4400E', 'GTX 770', 'Ryzen 5 5600', 'RTX 2070', 8, 110, 'poor', []),
  GM('game-34', 'EA Sports FC 24', 2023, 'Sports', 'Core i5-6600K', 'GTX 1050 Ti', 'Ryzen 7 5800X', 'RTX 2060', 8, 100, 'excellent', []),
  GM('game-35', 'Resident Evil 4 Remake', 2023, 'Horror', 'Ryzen 3 3200G', 'GTX 1050 Ti', 'Ryzen 7 5800X', 'RTX 3060', 16, 67, 'excellent', ['DLSS', 'FSR', 'XeSS']),
  GM('game-36', 'Dead Space Remake', 2023, 'Horror', 'Ryzen 5 1600', 'GTX 1070', 'Ryzen 7 5800X', 'RTX 3070', 16, 50, 'good', ['FSR']),
  GM('game-37', 'Star Wars Jedi: Survivor', 2023, 'Action', 'Ryzen 5 2600X', 'RX 580', 'Ryzen 7 5800X', 'RTX 3060 Ti', 16, 105, 'poor', ['DLSS', 'FSR', 'XeSS']),
  GM('game-38', 'F1 24', 2024, 'Racing', 'Ryzen 3 1200', 'GTX 1650', 'Ryzen 7 5800X', 'RTX 3060 Ti', 8, 100, 'excellent', ['DLSS', 'FSR', 'XeSS']),
  GM('game-39', 'Project CARS 2', 2017, 'Racing', 'Core i5-4670', 'GTX 660 Ti', 'Ryzen 7 5800X', 'RTX 2070', 8, 50, 'good', []),
  GM('game-40', 'Cities: Skylines II', 2023, 'Sim', 'Ryzen 5 2600X', 'GTX 1070', 'Ryzen 7 7800X3D', 'RTX 4070', 16, 60, 'poor', ['DLSS', 'FSR', 'XeSS']),
  GM('game-41', 'Age of Empires IV', 2021, 'Strategy', 'Core i5-8400', 'GTX 1050 Ti', 'Ryzen 7 5800X', 'RTX 2060', 8, 50, 'excellent', []),
  GM('game-42', 'Path of Exile 2', 2024, 'ARPG', 'Ryzen 3 3200G', 'GTX 960', 'Ryzen 7 5800X', 'RTX 3060', 12, 80, 'good', ['DLSS', 'FSR']),
  GM('game-43', 'Helldivers 2', 2024, 'Co-op Shooter', 'Core i7-6400', 'GTX 1050 Ti', 'Ryzen 7 5800X', 'RTX 3060', 8, 45, 'good', ['FSR']),
  GM('game-44', 'Palworld', 2024, 'Survival', 'Core i5-3570', 'GTX 1050', 'Ryzen 5 5600', 'RTX 2060', 16, 40, 'poor', ['DLSS', 'FSR']),
  GM('game-45', 'Like a Dragon: Infinite Wealth', 2024, 'RPG', 'Ryzen 5 2600', 'GTX 1060', 'Ryzen 7 5800X', 'RTX 2070 SUPER', 16, 80, 'excellent', ['DLSS', 'FSR']),
  GM('game-46', 'Final Fantasy XVI', 2024, 'RPG', 'Ryzen 5 3600', 'RX 6600', 'Ryzen 7 7800X3D', 'RTX 4070', 16, 100, 'good', ['FSR']),
  GM('game-47', 'Monster Hunter World', 2018, 'Action', 'Core i5-6400', 'GTX 760', 'Ryzen 7 5800X', 'RTX 2060', 8, 48, 'good', []),
  GM('game-48', 'Sekiro: Shadows Die Twice', 2019, 'Action', 'Core i3-6300', 'GTX 770', 'Ryzen 5 5600', 'GTX 1080', 8, 25, 'good', []),
  GM('game-49', 'DOOM Eternal', 2020, 'FPS', 'Ryzen 5 1400', 'GTX 1070', 'Ryzen 7 5800X', 'RTX 3070', 8, 80, 'excellent', []),
  GM('game-50', 'Quake II RTX / Nightdive', 2019, 'FPS', 'Core i5-2500K', 'GTX 1060', 'Ryzen 5 5600', 'RTX 4060', 8, 30, 'excellent', ['DLSS', 'FSR']),
  GM('game-51', 'Borderlands 3', 2019, 'Shooter', 'Ryzen 3 3200G', 'GTX 680', 'Ryzen 7 5800X', 'RTX 2060', 6, 75, 'good', ['DLSS', 'FSR']),
  GM('game-52', 'Far Cry 6', 2021, 'Action', 'Ryzen 5 1600', 'GTX 1060', 'Ryzen 7 5800X', 'RTX 3060 Ti', 16, 65, 'good', ['FSR', 'XeSS'])
];

W('motherboards.json', motherboards);
W('ram.json', ramKits);
W('storage.json', storage);
W('psus.json', psus);
W('cases.json', cases);
W('coolers.json', coolers);
W('games.json', games);
console.log(`Generated ${motherboards.length} motherboards, ${ramKits.length} RAM kits, ${storage.length} drives, ${psus.length} PSUs, ${cases.length} cases, ${coolers.length} coolers, ${games.length} games`);
