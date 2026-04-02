/* removed */
const path = require('path');

const csvPath = path.resolve(__dirname, 'dataset', 'up_large_dataset.csv');
const outDir = path.resolve(__dirname, 'public', 'data');
const outPath = path.join(outDir, 'schemes_summary.json');

function parseLine(line) {
  const parts = line.split(',');
  return {
    state: parts[0],
    district: parts[1],
    village: parts[2],
    scheme: parts[3],
    allocated_fund: Number(parts[4]) || 0,
    used_fund: Number(parts[5]) || 0,
    year: parts[6],
    work_type: parts[7]
  };
}

function groupArray(arr, key) {
  return arr.reduce((acc, r) => {
    const k = r[key] || 'UNKNOWN';
    if (!acc[k]) acc[k] = { allocated: 0, used: 0 };
    acc[k].allocated += r.allocated_fund;
    acc[k].used += r.used_fund;
    return acc;
  }, {});
}

try {
  const data = fs.readFileSync(csvPath, 'utf8');
  const lines = data.split(/\r?\n/).filter(Boolean);
  lines.shift(); // header
  const records = lines.map(parseLine);

  const schemes = Array.from(new Set(records.map(r => r.scheme))).sort();

  const schemes_data = {};
  schemes.forEach((scheme) => {
    const recs = records.filter(r => r.scheme === scheme);
    const total_allocated = recs.reduce((s, r) => s + r.allocated_fund, 0);
    const total_used = recs.reduce((s, r) => s + r.used_fund, 0);

    const byYear = groupArray(recs, 'year');
    const byVillage = groupArray(recs, 'village');
    const byDistrict = groupArray(recs, 'district');
    const byState = groupArray(recs, 'state');
    const byWorkType = groupArray(recs, 'work_type');

    function toArray(map) {
      return Object.keys(map).map(k => ({ key: k, allocated: map[k].allocated, used: map[k].used }))
        .sort((a, b) => (b.allocated - a.allocated));
    }

    schemes_data[scheme] = {
      total_allocated,
      total_used,
      byYear: toArray(byYear),
      byVillage: toArray(byVillage),
      byDistrict: toArray(byDistrict),
      byState: toArray(byState),
      byWorkType: toArray(byWorkType)
    };
  });

  const output = { schemes, schemes_data };
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
  console.log('Wrote', outPath);
} catch (err) {
  console.error('Error creating schemes summary:', err);
  process.exit(1);
}
