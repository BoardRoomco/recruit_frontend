export const resumeData: Record<string, string> = {
  'graeme begg': '/resumes/Graeme Begg.pdf',
  'mark khairallah': '/resumes/Mark Khairallah.pdf',
  'william park': '/resumes/Will Park.pdf',
  'joseph jabile': '/resumes/Joseph Jabile.pdf',
  'anush jayanthan': '/resumes/Anush Jayanthan.pdf',
  'osashade ashadele': '/resumes/Olalekan Ashadele.pdf',
  'thushkanth parameswaran': '/resumes/Thushanth Parameswaran.pdf',
  'omar elgazzar': '/resumes/Omar Elgazzar.pdf',
  'maximilian etzler fukushima': '/resumes/Maximilian Etzler Fukushima.pdf',
  'ahmed osman': '/resumes/Ahmed Osman.pdf',
};

export const getResumeUrl = (candidateName: string): string | null => {
  // Normalize the name: convert to lowercase and replace multiple spaces with single space
  const normalizedName = candidateName.toLowerCase().replace(/\s+/g, ' ').trim();
  
  // Try exact match first
  let result = resumeData[normalizedName];
  
  // If no exact match, try partial matching
  if (!result) {
    const availableKeys = Object.keys(resumeData);
    const matchingKey = availableKeys.find(key => 
      normalizedName.includes(key) || key.includes(normalizedName)
    );
    if (matchingKey) {
      result = resumeData[matchingKey];
    }
  }
  
  return result || null;
}; 