import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Clean and format doctor data
const doctors = [
  {
    name: "Dr. Jorge Maytorena",
    specialization: "Bariatric Surgery, Laparoscopic Surgery",
    therapy_type: "allopathy",
    experience_years: 15,
    location: "Tijuana",
    address: "Tijuana, Mexico",
    contact_number: "+1-555-0123",
    email: "jorge.maytorena@example.com",
    rating: 4.8,
    overview: "Dr. Jorge Maytorena is a top bariatric surgeon in Tijuana, Mexico, who helps people become healthier by doing special weight-loss surgeries.",
    profile_link: "https://www.placidway.com/doctor-detail/235/Dr-Jorge-Maytorena"
  },
  {
    name: "Dr. Omar D. Gonzalez",
    specialization: "Stem Cell Therapy",
    therapy_type: "regenerative",
    experience_years: 12,
    location: "Nuevo Progreso",
    address: "Nuevo Progreso, Mexico",
    contact_number: "+1-555-0124",
    email: "omar.gonzalez@example.com",
    rating: 4.7,
    overview: "Dr. Omar Gonzalez is a kind and smart doctor who helps people with different health problems using stem cell therapy.",
    profile_link: "https://www.placidway.com/doctor-detail/409/Dr-Omar-D-Gonzalez"
  },
  {
    name: "Dr. Octavio Herrera Osorio",
    specialization: "Gynecology, Reproductive Medicine",
    therapy_type: "allopathy",
    experience_years: 10,
    location: "Puebla",
    address: "Puebla, Mexico",
    contact_number: "+1-555-0125",
    email: "octavio.herrera@example.com",
    rating: 4.9,
    overview: "Dr. Octavio Herrera Osorio is a leading Obstetrician and Gynecologist with more than 10 years of experience at UNLIVE Clinic.",
    profile_link: "https://www.placidway.com/doctor-detail/57012/Dr-Octavio-Herrera-Osorio"
  },
  {
    name: "Dr. Carlos Bautista",
    specialization: "Oncology, Regenerative Medicine",
    therapy_type: "regenerative",
    experience_years: 20,
    location: "Tijuana",
    address: "Tijuana, Mexico",
    contact_number: "+1-555-0126",
    email: "carlos.bautista@example.com",
    rating: 4.9,
    overview: "Dr. Carlos Bautista is a kind and smart doctor who helps people fight cancer at Immunity Therapy Center using innovative approaches.",
    profile_link: "https://www.placidway.com/doctor-detail/57943/Dr-Carlos-Bautista"
  },
  {
    name: "Dr. Hardik Parikh",
    specialization: "Ophthalmology",
    therapy_type: "allopathy",
    experience_years: 15,
    location: "Mumbai",
    address: "Mumbai, India",
    contact_number: "+91-555-0127",
    email: "hardik.parikh@example.com",
    rating: 4.8,
    overview: "Dr. Hardik Parikh is the best eye surgeon in Mumbai, India with extensive experience in LASIK and other eye surgeries.",
    profile_link: "https://www.placidway.com/doctor-detail/57619/Dr-Hardik-Parikh-Eye-Surgeon-in-Mumbai-India"
  },
  {
    name: "Dr. Paul Casillas",
    specialization: "Addiction Psychiatry",
    therapy_type: "allopathy",
    experience_years: 18,
    location: "Tijuana",
    address: "Tijuana, Mexico",
    contact_number: "+1-555-0128",
    email: "paul.casillas@example.com",
    rating: 4.6,
    overview: "Dr. Paul Casillas is a leading expert in ibogaine treatment for addiction. He started working in this field in 2007.",
    profile_link: "https://www.placidway.com/doctor-detail/57800/Dr-Paul-Casillas-MD"
  },
  {
    name: "Dr. Patsama Vichinsartvichai",
    specialization: "IVF Specialist, Gynecology",
    therapy_type: "allopathy",
    experience_years: 14,
    location: "Bangkok",
    address: "Bangkok, Thailand",
    contact_number: "+66-555-0129",
    email: "patsama.v@example.com",
    rating: 4.9,
    overview: "Dr. Patsama Vichinsartvichai is a highly respected Gynecologist and IVF Specialist based in Bangkok, Thailand.",
    profile_link: "https://www.placidway.com/doctor-detail/57933/DrPatsama-Vichinsartvichai"
  },
  {
    name: "Dr. Anurak Amornpetchsathaporn",
    specialization: "Plastic Surgery",
    therapy_type: "allopathy",
    experience_years: 16,
    location: "Bangkok",
    address: "Bangkok, Thailand",
    contact_number: "+66-555-0130",
    email: "anurak.a@example.com",
    rating: 4.7,
    overview: "Dr. Anurak Amornpetchsathaporn is a highly esteemed board-certified cosmetic surgeon in Bangkok, Thailand.",
    profile_link: "https://www.placidway.com/doctor-detail/57938/Dr-Anuralc-Amornpetchsathaporn-HD"
  }
];

async function insertDoctors() {
  try {
    console.log('Starting to insert doctors...');
    
    const { data, error } = await supabase
      .from('doctors')
      .upsert(doctors, { 
        onConflict: 'email',
        ignoreDuplicates: false 
      });

    if (error) {
      console.error('Error inserting doctors:', error);
      throw error;
    }
    
    console.log('Successfully inserted doctors!');
    return data;
  } catch (error) {
    console.error('Error in insertDoctors function:', error);
    throw error;
  }
}

// Execute the function
insertDoctors()
  .then(() => console.log('Doctor insertion process completed'))
  .catch(err => console.error('Failed to insert doctors:', err));