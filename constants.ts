
export const JURISDICTION_COLORS: { [key: string]: string } = {
  US: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  EU: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  Global: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Japan: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  China: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  Default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

export const EVENT_TYPE_COLORS: { [key: string]: string } = {
  RegulatorySubmission: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  RegulatoryApproval: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  ClinicalTrialUpdate: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  Launch: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  Litigation: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  Partnership: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  Default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

export const FILTER_OPTIONS = {
    jurisdictions: ['US', 'EU', 'Global', 'Japan', 'China'],
    eventTypes: ['RegulatorySubmission', 'RegulatoryApproval', 'ClinicalTrialUpdate', 'Launch', 'Litigation', 'Partnership'],
    therapeuticAreas: ['Oncology', 'Immunology', 'Ophthalmology', 'Cardiovascular', 'Metabolic Diseases'],
};

export const DATE_RANGE_OPTIONS = [
    { label: 'All Time', value: 'all' },
    { label: 'Last 24h', value: '1' },
    { label: 'Last 7d', value: '7' },
    { label: 'Last 30d', value: '30' },
];

export const AUTO_REFRESH_INTERVAL_MS = 300000; // 5 minutes
export const DEBOUNCE_DELAY_MS = 500; // 0.5 seconds

export const ALL_COMPANIES = [
  'AbbVie', 'Accord', 'Alexion', 'Alteogen', 'Alvotech', 'Amgen', 'Amneal',
  'Apotex', 'Apotex/Apobiologix', 'Archigen [Samsung/AZ]', 'Ascendis',
  'AstraZeneca', 'Aurobindo', 'BMS', 'Beyond Spring', 'Bio-Thera', 'Biogen',
  'Biointegrat', 'Biocon Biologics', 'BioFacutura', 'Boehringer Ingelheim (BI)',
  'Boan Biotech', 'BSS/OcyonBio/Reliance Life Sciences', 'Celltrion', 'Civica',
  'Coherus', 'Daiichi Sankyo', 'Dong-A / Meiji', "Dr. Reddy's",
  'Eden Biologics', 'Enzene Biosciences A', 'Evive Biotech', 'Formycon',
  'Fresenius Kabi', 'Fujifilm', 'G1 Therapeutics', 'GE Healthcare/iBio',
  'Gedeon Richter', 'Gedon Richter', 'Henlius', 'Hetero', 'Hikma',
  'Innovent', 'Intas/Accord', 'J&J', 'LG Chem', 'Lannett', 'Lupin',
  'Luye Pharma', 'Mabion', 'Meitheal Pharma', 'MiGenTra',
  'MinaPharm Pharmaceuticals', 'Momenta Pharmaceuticals', 'Mundipharma',
  'Mycenax-Gedeon', 'NeuClone', 'Novo Nordisk', 'OPKO Health', 'Organon',
  'Pfizer', 'Prestige', 'Protheragen', 'Rani Therapeutics', 'Ratiopharm',
  'Regeneron', 'Roche', 'STADA', 'Sagent', 'Sam Chun Dang', 'Samsung Bioepis',
  'Similis Bio', 'Sorrento', 'Spectrum', 'Tanvex', 'Teva', 'UCB', 'USV',
  'UndBio', 'Xbrane', 'bioXpress'
].sort();
