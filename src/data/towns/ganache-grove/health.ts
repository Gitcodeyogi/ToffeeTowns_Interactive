export interface DiseaseProfile {
  name: string;
  symptoms: string[];
  treatment: string;
  contagionLevel: 'Low' | 'Medium' | 'High';
}

export interface TownHealth {
  doctorName: string;
  clinicCapacity: string;
  outbreak: DiseaseProfile;
}

export const health: TownHealth = {
  doctorName: 'Dr. Cedric Oakenhart',
  clinicCapacity: '8 Cots',
  outbreak: {
    name: 'Moss Sneezles',
    symptoms: [
      'Chocolate-scented sneezing',
      'Green nose tips',
      'Excessive tree hugging tendencies'
    ],
    treatment: 'Mint Leaf Tea and complete Forest Rest.',
    contagionLevel: 'Medium'
  }
};
