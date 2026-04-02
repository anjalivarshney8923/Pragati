// Location data for Indian states, districts, and villages
export const locationData = {
  "Uttar Pradesh": {
    "Ghaziabad": {
      villages: [
        "Bhojpur",
        "Loni",
        "Muradnagar",
        "Rajapur",
        "Other"
      ],
      panchayats: {
        "Bhojpur": [
          "AMIPURBADAYALA",
          "AMRALA",
          "ATRAULI",
          "AURANGABADDATERI",
          "AURANGABADFAZALGARH",
          "AURANGABADGADANA",
          "BAKHARVA",
          "BEGMABADBUDANA",
          "BHADAULA",
          "Other"
        ],
        "Loni": [
          "AFZALPUR",
          "AGRAULA",
          "ALLIPURNORASPUR",
          "ASALATPURFARAKHNAGAR",
          "AURANGABADRISTAL",
          "BADARPUR",
          "BANTHLA",
          "BHANERAKHURD",
          "CHIRORI",
          "GANAULI",
          "HAQIQATPURURFKHUDAWAS",
          "ILAICHIPUR",
          "JAVLI",
          "KHANPURJAPTI",
          "Other"
        ],
        "Muradnagar": [
          "ABUPUR",
          "ASADPURNAGAL",
          "ASALATNAGAR",
          "ASIFPURUJAIRA",
          "BANDIPUR",
          "BARAKAARIFPUR",
          "BASANTPURSAITLI",
          "BHADAULI",
          "BHANAIRA",
          "Other"
        ],
        "Rajapur": [
          "ABIDPURMANIKI",
          "ATAUR",
          "BAHADURPUR",
          "BHIKKANPUR",
          "BHOWAPUR",
          "CHITORA",
          "DASNADEHAT",
          "DAUSABANJARPUR",
          "DINANATHPURPUTHI",
          "Other"
        ],
        "Other": [
          "Other"
        ]
      }
    }
  }
};

// Get all states
export const getStates = () => Object.keys(locationData);

// Get districts for a state
export const getDistricts = (state) => {
  return locationData[state] ? Object.keys(locationData[state]) : [];
};

// Get villages for a state and district
export const getVillages = (state, district) => {
  return locationData[state] && locationData[state][district] && locationData[state][district].villages
    ? locationData[state][district].villages
    : [];
};

// Get panchayats for a state, district, and village
export const getPanchayats = (state, district, village) => {
  return locationData[state] && locationData[state][district] && locationData[state][district].panchayats && locationData[state][district].panchayats[village]
    ? locationData[state][district].panchayats[village]
    : [];
};